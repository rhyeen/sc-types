import { CardRarity } from "../../enums/card-rarity";
import { CardInterface } from "../../card.interface";
import { CardAbility } from "../card-ability";
import { CardConditions } from "../card-conditions";
import { CardType } from "../../enums/card-type";
import { CardHasher } from "../../services/card-hasher";
import { GuidGenerator } from "../../services/_generate-guid";

export class Card implements CardInterface {
  name: string;
  _id: string;
  type: CardType;
  rarity: CardRarity;
  abilities?: CardAbility[];
  cost?: number;
  _hash?: string;
  conditions: CardConditions;
  level?: number;

  constructor(rarity: CardRarity, type: CardType, abilities?: CardAbility[], cost?: number, cardName?: string, cardId?: string, cardHash?: string) {
    this.type = type;
    this.rarity = rarity;
    if (abilities) {
      this.abilities = abilities;
    } else {
      this.abilities = [];
    }
    this.name = cardName;
    if (cardId) {
      this.id = cardId;
    }
    if (cost || cost === 0) {
      this.cost = cost;
    } else {
      this.cost = 0;
    }
    this.conditions = new CardConditions();
    if (cardHash) {
      this.hash = cardHash;
    }
  }

  get id():string {
    if (!this._id) {
      this.generateNewId();
    }
    return this._id;
  }

  set id(id: string) {
    this._id = id;
  }

  get hash():string {
    if (!this._hash) {
      this._hash = 'temp';
      this._hash = CardHasher.getCardHash(this.copy(), true);
    }
    return this._hash;
  }

  set hash(hash: string) {
    this._hash = hash;
  }

  generateNewId() {
    this._id = GuidGenerator.generate('CR', 15);
  }

  toString(): string {
    return this.name + "::" + this.id;
  }

  hasAbility(id: string): boolean {
    for (const ability of this.abilities) {
      if (ability.id === id) {
        return true;
      }
    }
    return false;
  }

  getAbility(id: string): CardAbility {
    for (const ability of this.abilities) {
      if (ability.id === id) {
        return ability;
      }
    }
    throw new Error(`card does not have the ability ${id}`);
  }

  clearConditions() {
    this.conditions = new CardConditions();
  }

  copy():Card {
    throw new Error(`to copy a card, it must be of a class that extends Card`);
  }

  json(reduce?: boolean):any {
    if (!reduce) {
      throw new Error(`to jsonify a card, it must be of a class that extends Card`);
    }
    const card = {
      id: this.id
    };
    const conditions = this.conditions.json();
    if (conditions) {
      card['conditions'] = conditions;
    }
    return card;
  }
}
