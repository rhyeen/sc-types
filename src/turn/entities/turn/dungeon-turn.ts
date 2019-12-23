import { Game } from "../../../game/entities/game";
import { TurnResult } from "./turn-result";
import { TurnActionResult } from "../turn-action/turn-action-result";
import { TurnAction } from "../turn-action/turn-action";
import { MinionCard } from "../../../card/entities/card/minion-card";
import { DungeonMinionAttackAction } from "../turn-action/dungeon-turn-actions/dungeon-minion-attack-action";
import { PlayerActionTarget, PlayerMinionActionTarget } from "../action-target";

const MAX_ITERATIONS = 10;

export class DungeonTurn {
  static execute(game: Game):TurnResult {
    const turnResult = new TurnResult();
    let result = new TurnActionResult(game);
    let turnAction: TurnAction;
    let iteration = 0;
    const turnOrder = DungeonTurn.getFieldSlotIndexTurnOrder(result.game);
    for (const fieldSlotIndex of turnOrder) {
      // @NOTE: a dungeon minion may perform more than 1 turn action per turn, so loop until there is
      // nothing left for it to do.
      while (true || iteration > MAX_ITERATIONS) {
        turnAction = DungeonTurn.generateFieldTurnAction(result.game, fieldSlotIndex);
        if (!turnAction) {
          break;
        }
        iteration += 1;
        if (iteration > MAX_ITERATIONS) {
          throw new Error(`unexpected number of field turn actions (>${MAX_ITERATIONS}) for slot: ${fieldSlotIndex} in game: ${result.game.id}`);
        }
        result = turnAction.execute(result.game);
        turnResult.recordTurnActionResult(result);
      }
    }
    return turnResult;
  }

  private static getFieldSlotIndexTurnOrder(game: Game): number[] {
    const fieldSlotPriorities = [];
    for (let i = 0; i < game.dungeon.field.length; i++) {
      const priority = game.dungeon.field[i].getTurnPriority();
      fieldSlotPriorities.push({
        priority,
        slot: i
      });
    }
    fieldSlotPriorities.sort((a, b) => {
      const priorityDiff = a.priority - b.priority;
      if (priorityDiff === 0) {
        return a.slot - b.slot;
      }
      return priorityDiff;
    });
    return fieldSlotPriorities.map(fieldSlotPriority => fieldSlotPriority.slot);
  }

  private static generateFieldTurnAction(game: Game, fieldSlotIndex: number):TurnAction {
    const card = game.dungeon.field[fieldSlotIndex].card;
    if (!card || !(card instanceof MinionCard) || card.isExhausted()) {
      return null;
    }
    if (card.isDead()) {
      throw new Error(`dead card: ${card.hash}::${card.id} should be removed from field`);
    }
    if (game.canDungeonMinionAttackPlayer(fieldSlotIndex)) {
      return new DungeonMinionAttackAction(fieldSlotIndex, [new PlayerActionTarget()]);
    }
    const possibleTargets = game.getValidDungeonMinionAttackTargets(fieldSlotIndex);
    if (!possibleTargets.length) {
      return null;
    }
    const targetFieldIndex = DungeonTurn.getRandomArrayElement(possibleTargets);
    return new DungeonMinionAttackAction(fieldSlotIndex, [new PlayerMinionActionTarget(targetFieldIndex)]);
  }

  private static getRandomArrayElement(arr: any[]): any {
    return arr[Math.floor((Math.random() * arr.length))];
  }
}