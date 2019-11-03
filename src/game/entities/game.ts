import { Player } from './player/player';
import { Dungeon } from './dungeon';
import { CardSet } from '../../card/entities/card-set';

export class Game {
  player: Player;
  dungeon: Dungeon;
  cardSets: Record<string,CardSet>;

  constructor(player: Player, dungeon: Dungeon, cardSets: Record<string,CardSet>) {
    this.player = player;
    this.dungeon = dungeon;
    this.cardSets = cardSets;
  }

  copy():Game {
    const cardSets = this._copyCardSets();
    // @NOTE: the reason we need to pass through the cardsets is so that the copies of cards
    // within things like decks/fields uses the reference of the copied card sets so that
    // editing a card in a deck/field, edits the card within the card set.
    return new Game(this.player.copy(cardSets), this.dungeon.copy(cardSets), cardSets);
  }

  _copyCardSets():Record<string,CardSet> {
    const cardSets = {};
    for (const record in this.cardSets) {
      cardSets[record] = this.cardSets[record].copy();
    }
    return cardSets;
  }
}
