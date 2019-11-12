import { Player } from './player/player';
import { Dungeon } from './dungeon';
import { CardSet } from '../../card/entities/card-set';

export class Game {
  id: string;
  player: Player;
  dungeon: Dungeon;
  cardSets: Record<string,CardSet>;

  constructor(id: string, player: Player, dungeon: Dungeon, cardSets: Record<string,CardSet>) {
    this.id = id;
    this.player = player;
    this.dungeon = dungeon;
    this.cardSets = cardSets;
  }

  copy():Game {
    const cardSets = this.copyCardSets();
    // @NOTE: the reason we need to pass through the cardsets is so that the copies of cards
    // within things like decks/fields uses the reference of the copied card sets so that
    // editing a card in a deck/field, edits the card within the card set.
    return new Game(this.id, this.player.copy(cardSets), this.dungeon.copy(cardSets), cardSets);
  }

  private copyCardSets():Record<string,CardSet> {
    const cardSets = {};
    for (const record in this.cardSets) {
      cardSets[record] = this.cardSets[record].copy();
    }
    return cardSets;
  }

  getCard(cardHash: string, cardId: string) {
    if (!(cardHash in this.cardSets)) {
      throw new Error(`cardHash: ${cardHash} does not exist in game's cardSets`);
    }
    return this.cardSets[cardHash].getInstance(cardId);
  }

  json(reduce?: boolean, hidePrivate?: boolean):any {
    return {
      id: this.id,
      player: this.player.json(reduce, hidePrivate),
      dungeon: this.dungeon.json(hidePrivate),
      cardSets: this.jsonCardSets(reduce)
    };
  }

  private jsonCardSets(reduce?: boolean):any {
    const cardSets = {};
    for (const record in this.cardSets) {
      cardSets[record] = this.cardSets[record].json(reduce);
    }
    return cardSets;
  }
}
