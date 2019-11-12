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

  json():any {
    if (!this.card) {
      return {
        card: null
      }; 
    }
    return {
      card: {
        id: this.card.id,
        hash: this.card.hash
      }
    };
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

  json(hidePrivate?: boolean):any {
    let card = null;
    if (this.card) {
      card = {
        id: this.card.id,
        hash: this.card.hash
      };
    }
    return {
      card,
      backlog: this.jsonBacklog(hidePrivate)
    };
  }

  private jsonBacklog(hidePrivate?: boolean):any {
    if (hidePrivate) {
      return {
        size: this.backlog.length
      };
    }
    const backlog = [];
    for (const backlogCard of this.backlog) {
      backlog.push({
        id: backlogCard.id,
        hash: backlogCard.hash
      });
    }
    return {
      cards: backlog
    };
  }
}