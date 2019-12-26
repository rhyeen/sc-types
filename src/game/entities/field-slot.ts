import { CardSet } from "../../card/entities/card-set";
import { CardFinder } from "../../card/services/card-finder";
import { Card } from "../../card/entities/card/card";
import { CardRarity } from "../../card/enums/card-rarity";
import { CardType } from "../../card/enums/card-type";
import { MinionCard } from "../../card/entities/card/minion-card";

export class FieldSlot {
  card?: Card;

  constructor(card?: Card) {
    if (card) {
      this.card = card;
    }
  }

  clear():Card {
    const temp = this.card;
    this.card = null;
    return temp;
  }

  fill(card: Card) {
    this.card = card;
  }

  copy(cardSets: Record<string,CardSet>):FieldSlot {
    let card = this.card;
    if (card) {
      card = CardFinder.findCard(card, cardSets);
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

  refresh() {
    this.refreshCard();
  }

  private refreshCard() {
    if (!this.card) {
      return;
    }
    this.card.refresh();
  }
}

export class PlayerFieldSlot extends FieldSlot {
  constructor(card?: Card) {
    super(card);
  }
}

export class DungeonFieldSlot extends FieldSlot {
  _backlog?: Card[];
  _initialBacklogSize: number;

  constructor(card?: Card, backlog?: Card[]) {
    super(card);
    if (backlog) {
      this.backlog = backlog;
    } else {
      this.backlog = [];
    }
  }

  set backlog(backlog) {
    this._backlog = backlog;
    this._initialBacklogSize = this.backlog.length;
  }

  get backlog(): Card[] {
    return this._backlog;
  }

  get initialBacklogSize(): number {
    return this._initialBacklogSize;
  }

  getTurnPriority() {
    if (!this.card) {
      return -1;
    }
    return 5;
  }

  refill() {
    if (!this.card && this.backlog.length) {
      this.card = this.backlog.shift();
      if (this.card instanceof MinionCard) {
        this.card.exhaust();
      }
    }
  }

  copy(cardSets: Record<string,CardSet>):FieldSlot {
    let card = this.card;
    if (card) {
      card = CardFinder.findCard(card, cardSets);
    }
    const backlog = [];
    for (const backlogCard of this.backlog) {
      backlog.push(CardFinder.findCard(backlogCard, cardSets));
    }
    return new DungeonFieldSlot(card, backlog);
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

export class HiddenDungeonFieldSlot extends DungeonFieldSlot {
  constructor(card?: Card, backlogSize?: number) {
    const backlog = [];
    for (let i = 0; i < backlogSize; i += 1) {
      backlog.push(new Card(CardRarity.Undefined, CardType.Undefined));
    }
    super(card, backlog);
  }

  copy(cardSets: Record<string,CardSet>):FieldSlot {
    let card = this.card;
    if (card) {
      card = CardFinder.findCard(card, cardSets);
    }
    return new HiddenDungeonFieldSlot(card, this.backlog.length);
  }
}
