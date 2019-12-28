import { DraftCard } from "../../../card/entities/draft-card/draft-card";
import { CraftingPart } from "../../../card/entities/crafting-part";
import { Game } from "../../../game/entities/game";

export class DraftGenerationResult {
  baseDraftCards: DraftCard[];
  craftingParts: CraftingPart[];
  game: Game;

  constructor(game: Game) {
    this.game = game.copy();
    this.baseDraftCards = [];
    this.craftingParts = [];
  }

  recordGeneratedBaseDraftCards(baseDraftCards: DraftCard[]) {
    this.baseDraftCards = [...this.baseDraftCards, ...baseDraftCards];
  }

  recordGeneratedCraftingParts(craftingParts: CraftingPart[]) {
    this.craftingParts = [...this.craftingParts, ...craftingParts];
  }
}