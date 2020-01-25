import { TurnAction } from "../turn-action";
import { ActionType } from "../../../enums/action-type";
import { Game } from "../../../../game/entities/game";
import { TurnActionResult } from "../turn-action-result";
import { DraftCard } from "../../../../card/entities/draft-card/draft-card";
import { GameChange } from "../../../enums/game-change";
import { GamePhase } from "../../../../game/enums/game-phase";

export class CraftBaseCardAction extends TurnAction {
  baseCardIndex: number;
  forgeSlotIndex: number;

  constructor(baseCardIndex: number, forgeSlotIndex: number) {
    super(ActionType.CraftBaseCard);
    this.baseCardIndex = baseCardIndex;
    this.forgeSlotIndex = forgeSlotIndex;
  }

  json():any {
    return {
      type: this.type,
      baseCardIndex: this.baseCardIndex,
      forgeSlotIndex: this.forgeSlotIndex,
    };
  }

  execute(game: Game):TurnActionResult {
    this.validate(game);
    const result = new TurnActionResult(game);
    this.placeCardOnForge(result);
    return result;
  }

  validate(game: Game) {
    if (game.phase !== GamePhase.Draft) {
      throw new Error(`game phase: ${game.phase} should be ${GamePhase.Draft}`);
    }
    if (game.player.craftingTable.baseCards.length <= this.baseCardIndex) {
      throw new Error(`invalid base card index: ${this.baseCardIndex} with ${game.player.craftingTable.baseCards.length} base card(s) to pick from`);
    }
    if (game.player.craftingTable.forge.length <= this.forgeSlotIndex) {
      throw new Error(`invalid forge slot index: ${this.forgeSlotIndex} with ${game.player.craftingTable.forge.length} forge slot(s) to pick from`);
    }
    if (!(game.player.craftingTable.baseCards[this.baseCardIndex] instanceof DraftCard)) {
      throw new Error(`player hand card: ${this.baseCardIndex} is not a base card that can be placed in a forge`);
    }
  }

  placeCardOnForge(result: TurnActionResult) {
    result.game.player.craftingTable.fillForge(this.forgeSlotIndex, this.baseCardIndex);
    result.gameChanges.add(GameChange.PlayerBaseCards);
    result.gameChanges.add(GameChange.PlayerForge);
  }
}
