import { TurnAction } from "../turn-action";
import { ActionType } from "../../../enums/action-type";
import { Game } from "../../../../game/entities/game";
import { TurnActionResult } from "../turn-action-result";

export class CraftBaseCardAction extends TurnAction {
  forgeSlotIndex: number;

  constructor(forgeSlotIndex: number) {
    super(ActionType.CraftBaseCard);
    this.forgeSlotIndex = forgeSlotIndex;
  }

  json():any {
    return {
      type: this.type,
      forgeSlotIndex: this.forgeSlotIndex
    };
  }

  execute(game: Game):TurnActionResult {
    throw new Error(`cannot execute on a generic action type`);
  }

  validate(game: Game) {
    throw new Error(`cannot validate on a generic action type`);
  }
}
