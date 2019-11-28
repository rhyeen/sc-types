import { ValueEnsurer } from '../../services/value-ensurer';
import { CardSet } from '../../../card/entities/card-set';
import { CardIdentifier } from '../../../card/services/card-identifier';
import { Card } from '../../../card/entities/card/card';

export class Deck {
  cards: Card[];

  constructor(cards?: Card[]) {
    if (cards) {
      this.cards = cards;
    } else {
      this.cards = [];
    }
  }

  size() {
    return this.cards.length;
  }

  add(card: Card) {
    this.cards.push(card);
  }

  remove(cardIndex: number):Card {
    if (this.size() <= cardIndex || cardIndex < 0) {
      throw new Error(`cardIndex: ${cardIndex} out of bound of deck of size: ${this.size()}`);
    }
    return this.cards.splice(cardIndex, 1)[0];
  }

  shuffle() {
    for (let i = 0; i < this.cards.length; i += 1) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = this.cards[i];
      this.cards[i] = this.cards[j];
      this.cards[j] = temp;
    }
  }

  copy(cardSets: Record<string,CardSet>):Deck {
    return new Deck(this.copyCards(cardSets));
  }

  protected copyCards(cardSets: Record<string,CardSet>):Card[] {
    const result = [];
    for (const card of this.cards) {
      result.push(CardIdentifier.findCard(card, cardSets));
    }
    return result;
  }

  json():any {
    return {
      cards: this.jsonCards()
    };
  }

  protected jsonCards():any {
    const result = [];
    for (const card of this.cards) {
      result.push({
        id: card.id,
        hash: card.hash
      });
    }
    return result;
  }
}

export class DrawDeck extends Deck {
  constructor(cards?: Card[]) {
    super(cards);
  }

  json(hidePrivate?: boolean):any {
    if (hidePrivate) {
      return {
        size: this.cards.length
      };
    }
    return {
      cards: this.jsonCards()
    };
  }
}

export class PlayerDrawDeck extends DrawDeck {
  constructor(cards?: Card[]) {
    super(cards);
  }
}

export class DiscardDeck extends Deck {
  constructor(cards?: Card[]) {
    super(cards);
  }
}

export class PlayerDiscardDeck extends DiscardDeck {
  constructor(cards?: Card[]) {
    super(cards);
  }

  // @MUTATES: card
  add(card: Card) {
    card.clearConditions();
    this.cards.push(card);
  }
}

export class LostDeck extends Deck {
  constructor(cards?: Card[]) {
    super(cards);
  }
}

export class PlayerLostDeck extends LostDeck {
  constructor(cards?: Card[]) {
    super(cards);
  }

  // @MUTATES: card
  add(card: Card) {
    card.clearConditions();
    this.cards.push(card);
  }
}

export class Hand extends Deck {
  constructor(cards?: Card[]) {
    super(cards);
  }
}

export class PlayerHand extends Hand {
  _refillSize: number;

  constructor(refillSize: number, cards?: Card[]) {
    super(cards);
    this.refillSize = refillSize;
  }

  get refillSize() {
    return this._refillSize;
  }

  set refillSize(value: number) {
    this._refillSize = ValueEnsurer.ensureNonNegative(value);
  }

  copy(cardSets: Record<string,CardSet>):PlayerHand {
    return new PlayerHand(this.refillSize, this.copyCards(cardSets));
  }

  protected copyCards(cardSets: Record<string,CardSet>):Card[] {
    const result = [];
    for (const card of this.cards) {
      result.push(CardIdentifier.findCard(card, cardSets));
    }
    return result;
  }
}