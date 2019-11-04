import { Game } from "../../../game/entities/game";
import { GameChange } from "../../enums/game-change";
import { Card } from "../../../card/entities/card/card";

export class TurnActionResult {
  game: Game;
  gameChanges: Set<GameChange>;
  cardChanges: Set<Card>;

  constructor(game: Game) {
    this.game = game.copy();
    this.gameChanges = new Set();
    this.cardChanges = new Set();
  }

  recordGameChange(gameChange: GameChange) {
    this.gameChanges.add(gameChange);
  }

  recordCardChange(card: Card) {
    this.cardChanges.add(card);
  }
}