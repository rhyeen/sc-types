import { Game } from "../../../game/entities/game";
import { GameChange } from "../../enums/game-change";
import { Card } from "../../../card/entities/card/card";
import { CardSet } from "../../../card/entities/card-set";
import { DraftCard } from "../../../card/entities/draft-card/draft-card";

export class TurnActionResult {
  game: Game;
  gameChanges: Set<GameChange>;
  cardChanges: Set<Card>;
  draftCardChanges: Set<DraftCard>;
  cardSetAdditions: Set<CardSet>;

  constructor(game: Game) {
    this.game = game.copy();
    this.gameChanges = new Set();
    this.cardChanges = new Set();
    this.draftCardChanges = new Set();
    this.cardSetAdditions = new Set();
  }

  recordDraftCardChange(draftCard: DraftCard) {
    this.draftCardChanges.add(draftCard);
  }

  recordGameChange(gameChange: GameChange) {
    this.gameChanges.add(gameChange);
  }

  recordCardChange(card: Card) {
    this.cardChanges.add(card);
  }

  recordCardSetAddition(cardSet: CardSet) {
    this.cardSetAdditions.add(cardSet);
  }
}