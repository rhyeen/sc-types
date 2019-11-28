import { ActionWithTargets } from "./turn-action";
import { ActionType } from "../../enums/action-type";
import { ActionTarget, OpponentMinionActionTarget } from "../action-target";
import { Game } from "../../../game/entities/game";
import { TurnActionResult } from "./turn-action-result";
import { MinionCard } from "../../../card/entities/card/minion-card";
import { GameChange } from "../../enums/game-change";

export class PlayMinionAttackAction extends ActionWithTargets {
  playerSourceFieldIndex: number;

  constructor(playerSourceFieldIndex: number, targets: ActionTarget[]) {
    super(ActionType.PlayMinionAttack, targets);
    this.playerSourceFieldIndex = playerSourceFieldIndex;
  }

  json():any {
    return {
      type: this.type,
      source: {
        fieldIndex: this.playerSourceFieldIndex
      },
      targets: this.targetsJson()
    };
  }

  execute(game: Game):TurnActionResult {
    this.validate(game);
    const result = new TurnActionResult(game);
    for (const target of this.targets) {
      if (!(target instanceof OpponentMinionActionTarget)) {
        continue;
      }
      this.attackTarget(result, target.targetOpponentFieldIndex);
    }
    return result;
  }

  validate(game: Game) {
    if (game.player.field.length <= this.playerSourceFieldIndex) {
      throw new Error(`invalid player field index: ${this.playerSourceFieldIndex} with player field of size: ${game.player.field.length}`);
    }
    const attackingCard = game.player.field[this.playerSourceFieldIndex].card;
    if (!attackingCard || !(attackingCard instanceof MinionCard)) {
      throw new Error(`player minion card not present at field index: ${this.playerSourceFieldIndex}`);
    }
    if (this.targets.length !== 1) {
      throw new Error(`player minion card should have exactly 1 target, found: ${this.targets.length}`);
    }
    for (const target of this.targets) {
      if (!(target instanceof OpponentMinionActionTarget)) {
        throw new Error(`invalid target type: ${typeof target}.  Should be of type: OpponentMinionActionTarget`);
      }
      if (game.dungeon.field.length <= target.targetOpponentFieldIndex) {
        throw new Error(`invalid opponent field index: ${target.targetOpponentFieldIndex} with dungeon field of size: ${game.dungeon.field.length}`);
      }
      let attackedCard = game.dungeon.field[target.targetOpponentFieldIndex].card;
      if (!attackedCard || !(attackedCard instanceof MinionCard)) {
        throw new Error(`player minion card must attack field: ${target.targetOpponentFieldIndex} that contains a minion card`);
      }
      if (!(target.targetOpponentFieldIndex in game.getValidPlayerMinionAttackTargets(this.playerSourceFieldIndex))) {
        throw new Error(`player minion card cannot reach: ${target.targetOpponentFieldIndex}`);
      }
    }
  }

  // @MUTATES: result, attackingCard, attackedCard
  private attackTarget(result: TurnActionResult, targetOpponentFieldIndex: number) {
    const attackingCard = result.game.player.field[this.playerSourceFieldIndex].card;
    if (!(attackingCard instanceof MinionCard)) {
      return;
    }
    const attackedCard = result.game.dungeon.field[targetOpponentFieldIndex].card;
    if (!(attackedCard instanceof MinionCard)) {
      return;
    }
    attackingCard.attackCard(attackedCard);
    if (result.game.dungeonCardCanRetaliate(this.playerSourceFieldIndex, targetOpponentFieldIndex)) {
      attackedCard.attackCard(attackingCard);
    }
    result.recordCardChange(attackingCard);
    result.recordCardChange(attackedCard);
    if (attackingCard.health <= 0) {
      result.game.player.discardDeck.add(attackingCard);
      result.game.player.field[this.playerSourceFieldIndex].clear();
      result.recordGameChange(GameChange.PlayerDiscardDeck);
      result.recordGameChange(GameChange.PlayerField);
    }
    if (attackedCard.health <= 0) {
      result.game.dungeon.field[targetOpponentFieldIndex].clear();
      result.recordGameChange(GameChange.DungeonField);
    }
  }
}
