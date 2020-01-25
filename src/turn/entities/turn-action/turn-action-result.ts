import { Game } from "../../../game/entities/game";
import { GameChange } from "../../enums/game-change";
import { Card } from "../../../card/entities/card/card";
import { CardSet } from "../../../card/entities/card-set";

export class TurnActionResult {
  game: Game;
  gameChanges: Set<GameChange>;
  cardChanges: Set<Card>;
  cardSetAdditions: Set<CardSet>;

  constructor(game: Game) {
    this.game = game.copy();
    this.gameChanges = new Set();
    this.cardChanges = new Set();
    this.cardSetAdditions = new Set();
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