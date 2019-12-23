import { ActionWithTargets } from "../turn-action";
import { ActionType } from "../../../enums/action-type";
import { ActionTarget } from "../../action-target";
import { Game } from "../../../../game/entities/game";
import { TurnActionResult } from "../turn-action-result";

export class PlaySpellAbilityAction extends ActionWithTargets {
  playerSourceHandIndex: number;
  targets: ActionTarget[];

  constructor(playerSourceHandIndex: number, targets: ActionTarget[]) {
    super(ActionType.PlaySpellAbility, targets);
    this.playerSourceHandIndex = playerSourceHandIndex;
  }

  json():any {
    return {
      type: this.type,
      source: {
        handIndex: this.playerSourceHandIndex
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
