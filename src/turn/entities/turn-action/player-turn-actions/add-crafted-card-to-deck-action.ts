import { TurnAction } from "../turn-action";
import { ActionType } from "../../../enums/action-type";
import { Game } from "../../../../game/entities/game";
import { TurnActionResult } from "../turn-action-result";

export class AddCraftedCardToDeckAction extends TurnAction {
  forgeSlotIndex: number;
  numberOfInstances: number;
  cardId: string;
  cardName: string;

  constructor(forgeSlotIndex: number, numberOfInstances: number, cardId: string, cardName: string) {
    super(ActionType.AddCraftedCardToDeck);
    this.forgeSlotIndex = forgeSlotIndex;
    this.numberOfInstances = numberOfInstances;
    this.cardId = cardId;
    this.cardName = cardName;
  }

  json():any {
    return {
      type: this.type,
      forgeSlotIndex: this.forgeSlotIndex,
      numberOfInstances: this.numberOfInstances,
      cardId: this.cardId,
      cardName: this.cardName
    };
  }

  execute(game: Game):TurnActionResult {
    throw new Error(`cannot execute on a generic action type`);
  }

  validate(game: Game) {
    throw new Error(`cannot validate on a generic action type`);
  }
}
