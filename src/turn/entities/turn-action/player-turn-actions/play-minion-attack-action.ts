import { ActionWithTargets } from "../turn-action";
import { ActionType } from "../../../enums/action-type";
import { ActionTarget, DungeonMinionActionTarget } from "../../action-target";
import { Game } from "../../../../game/entities/game";
import { TurnActionResult } from "../turn-action-result";
import { MinionCard } from "../../../../card/entities/card/minion-card";
import { GameChange } from "../../../enums/game-change";
import { GamePhase } from "../../../../game/enums/game-phase";

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
      if (target instanceof DungeonMinionActionTarget) {
        this.attackDungeonMinionTarget(result, target.targetDungeonFieldIndex);
      }
    }
    return result;
  }

  validate(game: Game) {
    if (game.phase !== GamePhase.Battle) {
      throw new Error(`game phase: ${game.phase} should be ${GamePhase.Battle}`);
    }
    if (game.player.field.length <= this.playerSourceFieldIndex) {
      throw new Error(`invalid player field index: ${this.playerSourceFieldIndex} with player field of size: ${game.player.field.length}`);
    }
    const attackingCard = game.player.field[this.playerSourceFieldIndex].card;
    if (!attackingCard || !(attackingCard instanceof MinionCard)) {
      throw new Error(`player minion card not present at field index: ${this.playerSourceFieldIndex}`);
    }
    if (attackingCard.isExhausted()) {
      throw new Error(`player minion card cannot attack if exhausted`);
    }
    if (this.targets.length !== 1) {
      throw new Error(`player minion card should have exactly 1 target, found: ${this.targets.length}`);
    }
    for (const target of this.targets) {
      if (target instanceof DungeonMinionActionTarget) {
        if (game.dungeon.field.length <= target.targetDungeonFieldIndex) {
          throw new Error(`invalid dungeon field index: ${target.targetDungeonFieldIndex} with dungeon field of size: ${game.dungeon.field.length}`);
        }
        const attackedCard = game.dungeon.field[target.targetDungeonFieldIndex].card;
        if (!attackedCard || !(attackedCard instanceof MinionCard)) {
          throw new Error(`player minion card must attack field: ${target.targetDungeonFieldIndex} that contains a minion card`);
        }
        if (!(game.getValidPlayerMinionAttackTargets(this.playerSourceFieldIndex).includes(target.targetDungeonFieldIndex))) {
          throw new Error(`player minion card cannot reach: ${target.targetDungeonFieldIndex}`);
        }
      } else {
        throw new Error(`invalid target type: ${typeof target}.  Should be of type: DungeonMinionActionTarget`);
      }
    }
  }

  private attackDungeonMinionTarget(result: TurnActionResult, targetDungeonFieldIndex: number) {
    const attackingCard = result.game.player.field[this.playerSourceFieldIndex].card;
    if (!(attackingCard instanceof MinionCard)) {
      return;
    }
    const attackedCard = result.game.dungeon.field[targetDungeonFieldIndex].card;
    if (!(attackedCard instanceof MinionCard)) {
      return;
    }
    attackingCard.attackCard(attackedCard);
    if (result.game.dungeonCardCanRetaliate(this.playerSourceFieldIndex, targetDungeonFieldIndex)) {
      attackedCard.attackCard(attackingCard);
    }
    attackingCard.exhaust();
    result.recordCardChange(attackingCard);
    result.recordCardChange(attackedCard);
    if (attackingCard.isDead()) {
      result.game.player.discardDeck.add(attackingCard);
      result.game.player.field[this.playerSourceFieldIndex].clear();
      result.recordGameChange(GameChange.PlayerDiscardDeck);
      result.recordGameChange(GameChange.PlayerField);
    }
    if (attackedCard.isDead()) {
      result.game.dungeon.field[targetDungeonFieldIndex].clear();
      result.recordGameChange(GameChange.DungeonField);
    }
  }
}
