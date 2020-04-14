import { ActionWithTargets } from "../turn-action";
import { ActionType } from "../../../enums/action-type";
import { ActionTarget, PlayerMinionActionTarget, PlayerActionTarget, DungeonActionTarget, DungeonMinionActionTarget } from "../../action-target";
import { Game } from "../../../../game/entities/game";
import { TurnActionResult } from "../turn-action-result";
import { MinionCard } from "../../../../card/entities/card/minion-card";
import { GameChange } from "../../../enums/game-change";
import { CardAbility } from "../../../../card/entities/card-ability";

export class DungeonMinionPlayAbilityAction extends ActionWithTargets {
  dungeonSourceFieldIndex: number;
  abilityIndex: number;

  constructor(dungeonSourceFieldIndex: number, abilityIndex: number, targets: ActionTarget[]) {
    super(ActionType.PlayMinionAbility, targets);
    this.dungeonSourceFieldIndex = dungeonSourceFieldIndex;
    this.abilityIndex = abilityIndex;
  }

  json():any {
    return {
      type: this.type,
      source: {
        fieldIndex: this.dungeonSourceFieldIndex,
        abilityIndex: this.abilityIndex,
      },
      targets: this.targetsJson()
    };
  }

  execute(game: Game):TurnActionResult {
    this.validate(game);
    const result = new TurnActionResult(game);
    for (const target of this.targets) {
      if (target instanceof DungeonMinionActionTarget) {
        this.useAbilityOnDungeonMinionTarget(result, target.targetDungeonFieldIndex);
      }
      if (target instanceof DungeonActionTarget) {
        throw new Error(`there is currently no concept of using an ability on the dungeon itself`);
      }
      if (target instanceof PlayerMinionActionTarget) {
        this.useAbilityOnPlayerMinionTarget(result, target.targetPlayerFieldIndex);
      }
      if (target instanceof PlayerActionTarget) {
        this.useAbilityOnPlayer(result);
      }
    }
    this.getAbility(result.game).use();
    result.recordGameChange(GameChange.DungeonField);
    return result;
  }

  getAbility(game: Game):CardAbility {
    const minion = this.getMinionCard(game);
    if (!minion.abilities) {
      throw new Error(`dungeon minion card must have abilities`);
    }
    if (minion.abilities.length <= this.abilityIndex) {
      throw new Error(`invalid ability index: ${this.abilityIndex} with an ability array of size: ${minion.abilities.length}`);
    }
    return this.getMinionCard(game).abilities[this.abilityIndex];
  }

  getMinionCard(game: Game):MinionCard {
    if (game.dungeon.field.length <= this.dungeonSourceFieldIndex) {
      throw new Error(`invalid dungeon field index: ${this.dungeonSourceFieldIndex} with dungeon field of size: ${game.dungeon.field.length}`);
    }
    const minion = game.dungeon.field[this.dungeonSourceFieldIndex].card;
    if (!minion || !(minion instanceof MinionCard)) {
      throw new Error(`dungeon minion card not present at field index: ${this.dungeonSourceFieldIndex}`);
    }
    return minion;
  }

  validate(game: Game) {
    this.getMinionCard(game);
    const ability = this.getAbility(game);
    if (ability.used) {
      throw new Error(`ability has already been used`);
    }
    for (const target of this.targets) {
      if (target instanceof PlayerMinionActionTarget) {
        if (game.player.field.length <= target.targetPlayerFieldIndex) {
          throw new Error(`invalid player field index: ${target.targetPlayerFieldIndex} with player field of size: ${game.player.field.length}`);
        }
        const targetedCard = game.player.field[target.targetPlayerFieldIndex].card;
        if (!targetedCard || !(targetedCard instanceof MinionCard)) {
          throw new Error(`dungeon minion card must target field: ${target.targetPlayerFieldIndex} that contains a minion card`);
        }
      } else if (target instanceof DungeonMinionActionTarget) {
        if (game.dungeon.field.length <= target.targetDungeonFieldIndex) {
          throw new Error(`invalid dungeon field index: ${target.targetDungeonFieldIndex} with dungeon field of size: ${game.dungeon.field.length}`);
        }
        const targetedCard = game.player.field[target.targetDungeonFieldIndex].card;
        if (!targetedCard || !(targetedCard instanceof MinionCard)) {
          throw new Error(`dungeon minion card must target field: ${target.targetDungeonFieldIndex} that contains a minion card`);
        }
      } else if (target instanceof DungeonActionTarget) {
        throw new Error(`there is currently no concept of using an ability on the dungeon itself`);
      }
    }
  }

  private useAbilityOnDungeonMinionTarget(result: TurnActionResult, targetPlayerFieldIndex: number) {
    throw new Error(`not implemented`);
  }

  private useAbilityOnPlayerMinionTarget(result: TurnActionResult, targetPlayerFieldIndex: number) {
    throw new Error(`not implemented`);
  }

  private useAbilityOnPlayer(result: TurnActionResult) {
    throw new Error(`not implemented`);
  }
}
