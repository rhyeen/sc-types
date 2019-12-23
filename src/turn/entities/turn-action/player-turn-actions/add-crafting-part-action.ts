import { ActionType } from "../../../enums/action-type";
import { TurnAction } from "../turn-action";
import { Game } from "../../../../game/entities/game";
import { TurnActionResult } from "../turn-action-result";

export class AddCraftingPartAction extends TurnAction {
  craftingPartIndex: number;
  forgeSlotIndex: number;

  constructor(craftingPartIndex: number, forgeSlotIndex: number) {
    super(ActionType.AddCraftingPart);
    this.craftingPartIndex = craftingPartIndex;
    this.forgeSlotIndex = forgeSlotIndex;
  }

  json():any {
    return {
      type: this.type,
      craftingPartIndex: this.craftingPartIndex,
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
