import { GameChange } from "../../enums/game-change";
import { Card } from "../../../card/entities/card/card";
import { TurnActionResult } from "../turn-action/turn-action-result";
import { Game } from "../../../game/entities/game";
import { CardFinder } from "../../../card/services/card-finder";
import { DraftGenerationResult } from "../turn-action/draft-generation-result";
import { DraftCard } from "../../../card/entities/draft-card/draft-card";
import { CraftingPart } from "../../../card/entities/crafting-part";

export class TurnResult {
  gameChanges: Set<GameChange>;
  cardChanges: Set<Card>;
  game: Game;
  baseDraftCards: DraftCard[];
  craftingParts: CraftingPart[];

  constructor(game?: Game) {
    if (game) {
      this.game = game;
    }
    this.gameChanges = new Set();
    this.cardChanges = new Set();
    this.baseDraftCards = [];
    this.craftingParts = [];
  }

  recordTurnActionResult(result: TurnActionResult) {
    this.game = result.game;
    this.migrateCardChangesToLatestGame();
    this.gameChanges = new Set([...this.gameChanges, ...result.gameChanges]);
    this.cardChanges = new Set([...this.cardChanges, ...result.cardChanges]);
  }

  // @NOTE: this is because every recorded change has a new game with new card pointer references.
  private migrateCardChangesToLatestGame() {
    const latestGameCardChanges = new Set<Card>();
    for (const cardChange of this.cardChanges) {
      latestGameCardChanges.add(CardFinder.findCard(cardChange, this.game.cardSets));
    }
    this.cardChanges = latestGameCardChanges;
  }

  recordDraftGenerationResult(draftGenerationResult: DraftGenerationResult) {
    this.game = draftGenerationResult.game;
    this.migrateCardChangesToLatestGame();
    this.baseDraftCards = [...this.baseDraftCards, ...draftGenerationResult.baseDraftCards];
    this.craftingParts = [...this.craftingParts, ...draftGenerationResult.craftingParts];
  }
}