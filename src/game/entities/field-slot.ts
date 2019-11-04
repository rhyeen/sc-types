import { CardSet } from "../../card/entities/card-set";
import { CardIdentifier } from "../../card/services/card-identifier";
import { Card } from "../../card/entities/card/card";

export class FieldSlot {
  card?: Card;

  constructor(card?: Card) {
    if (card) {
      this.card = card;
    }
  }

  clear() {
    this.card = null;
  }

  fill(card: Card) {
    this.card = card;
  }

  copy(cardSets: Record<string,CardSet>):FieldSlot {
    let card = this.card;
    if (card) {
      card = CardIdentifier.findCard(card, cardSets);
    }
    return new FieldSlot(card);
  }
}

export class PlayerFieldSlot extends FieldSlot {
  constructor(card?: Card) {
    super(card);
  }
}

export class DungeonFieldSlot extends FieldSlot {
  backlog?: Card[];

  constructor(card?: Card, backlog?: Card[]) {
    super(card);
    if (backlog) {
      this.backlog = backlog;
    } else {
      this.backlog = [];
    }
  }

  copy(cardSets: Record<string,CardSet>):FieldSlot {
    let card = this.card;
    if (card) {
      card = CardIdentifier.findCard(card, cardSets);
    }
    const backlog = [];
    for (const backlogCard of this.backlog) {
      backlog.push(CardIdentifier.findCard(backlogCard, cardSets));
    }
    return new DungeonFieldSlot(card, this.backlog);
  }
}