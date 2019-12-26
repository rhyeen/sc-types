import { ActionWithTargets } from "../turn-action";
import { ActionType } from "../../../enums/action-type";
import { ActionTarget, PlayerMinionActionTarget, PlayerActionTarget } from "../../action-target";
import { Game } from "../../../../game/entities/game";
import { TurnActionResult } from "../turn-action-result";
import { MinionCard } from "../../../../card/entities/card/minion-card";
import { GameChange } from "../../../enums/game-change";

export class DungeonMinionAttackAction extends ActionWithTargets {
  dungeonSourceFieldIndex: number;

  constructor(dungeonSourceFieldIndex: number, targets: ActionTarget[]) {
    super(ActionType.PlayMinionAttack, targets);
    this.dungeonSourceFieldIndex = dungeonSourceFieldIndex;
  }

  json():any {
    return {
      type: this.type,
      source: {
        fieldIndex: this.dungeonSourceFieldIndex
      },
      targets: this.targetsJson()
    };
  }

  execute(game: Game):TurnActionResult {
    this.validate(game);
    const result = new TurnActionResult(game);
    for (const target of this.targets) {
      if (target instanceof PlayerMinionActionTarget) {
        this.attackPlayerMinionTarget(result, target.targetPlayerFieldIndex);
      }
      if (target instanceof PlayerActionTarget) {
        this.attackPlayer(result);
      }
    }
    return result;
  }

  validate(game: Game) {
    if (game.dungeon.field.length <= this.dungeonSourceFieldIndex) {
      throw new Error(`invalid dungeon field index: ${this.dungeonSourceFieldIndex} with dungeon field of size: ${game.dungeon.field.length}`);
    }
    const attackingCard = game.dungeon.field[this.dungeonSourceFieldIndex].card;
    if (!attackingCard || !(attackingCard instanceof MinionCard)) {
      throw new Error(`dungeon minion card not present at field index: ${this.dungeonSourceFieldIndex}`);
    }
    if (attackingCard.isExhausted()) {
      throw new Error(`dungeon minion card cannot attack if exhausted`);
    }
    if (this.targets.length !== 1) {
      throw new Error(`dungeon minion card should have exactly 1 target, found: ${this.targets.length}`);
    }
    for (const target of this.targets) {
      if (target instanceof PlayerMinionActionTarget) {
        if (game.player.field.length <= target.targetPlayerFieldIndex) {
          throw new Error(`invalid opponent field index: ${target.targetPlayerFieldIndex} with player field of size: ${game.player.field.length}`);
        }
        const attackedCard = game.player.field[target.targetPlayerFieldIndex].card;
        if (!attackedCard || !(attackedCard instanceof MinionCard)) {
          throw new Error(`dungeon minion card must attack field: ${target.targetPlayerFieldIndex} that contains a minion card`);
        }
        if (!(game.getValidDungeonMinionAttackTargets(this.dungeonSourceFieldIndex).includes(target.targetPlayerFieldIndex))) {
          throw new Error(`dungeon minion card cannot reach: ${target.targetPlayerFieldIndex}`);
        }
      } else if (target instanceof PlayerActionTarget) {
        if (!game.canDungeonMinionAttackPlayer(this.dungeonSourceFieldIndex)) {
          throw new Error(`dungeon minion card cannot attack player`);
        }
      } else {
        throw new Error(`invalid target type: ${typeof target}.  Should be of type: PlayerMinionActionTarget or PlayerActionTarget`);
      }
    }
  }

  private attackPlayerMinionTarget(result: TurnActionResult, targetPlayerFieldIndex: number) {
    const attackingCard = result.game.dungeon.field[this.dungeonSourceFieldIndex].card;
    if (!(attackingCard instanceof MinionCard)) {
      return;
    }
    const attackedCard = result.game.player.field[targetPlayerFieldIndex].card;
    if (!(attackedCard instanceof MinionCard)) {
      return;
    }
    attackingCard.attackCard(attackedCard);
    if (result.game.playerCardCanRetaliate(this.dungeonSourceFieldIndex, targetPlayerFieldIndex)) {
      attackedCard.attackCard(attackingCard);
    }
    attackingCard.exhaust();
    result.recordCardChange(attackingCard);
    result.recordCardChange(attackedCard);
    if (attackingCard.isDead()) {
      result.game.dungeon.field[this.dungeonSourceFieldIndex].clear();
      result.recordGameChange(GameChange.DungeonField);
    }
    if (attackedCard.isDead()) {
      result.game.player.discardDeck.add(attackedCard);
      result.game.player.field[targetPlayerFieldIndex].clear();
      result.recordGameChange(GameChange.PlayerDiscardDeck);
      result.recordGameChange(GameChange.PlayerField);
    }
  }

  private attackPlayer(result: TurnActionResult) {
    const attackingCard = result.game.dungeon.field[this.dungeonSourceFieldIndex].card;
    if (!(attackingCard instanceof MinionCard)) {
      return;
    }
    result.game.player.health.decrease(attackingCard.attackPlayerDamage());
    attackingCard.exhaust();
    result.recordCardChange(attackingCard);
    result.recordGameChange(GameChange.PlayerHealth)
  }
}
