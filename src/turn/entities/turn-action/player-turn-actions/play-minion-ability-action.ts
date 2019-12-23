import { ActionWithTargets } from "../turn-action";
import { ActionTarget } from "../../action-target";
import { ActionType } from "../../../enums/action-type";
import { Game } from "../../../../game/entities/game";
import { TurnActionResult } from "../turn-action-result";

export class PlayMinionAbilityAction extends ActionWithTargets {
  playerSourceFieldIndex: number;
  targets: ActionTarget[];

  constructor(playerSourceFieldIndex: number, targets: ActionTarget[]) {
    super(ActionType.PlayMinionAbility, targets);
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
    throw new Error(`cannot execute on a generic action type`);
  }

  validate(game: Game) {
    throw new Error(`cannot validate on a generic action type`);
  }
}
