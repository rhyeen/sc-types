import { ActionWithTargets } from "./turn-action";
import { ActionType } from "../../enums/action-type";
import { ActionTarget } from "../action-target";
import { Game } from "../../../game/entities/game";
import { TurnActionResult } from "./turn-action-result";

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
    throw new Error(`cannot execute on a generic action type`);
  }

  validate(game: Game) {
    throw new Error(`cannot validate on a generic action type`);
  }
}
