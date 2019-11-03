import { CardRarity } from "../../enums/card-rarity";
import { CardInterface, copyCardAbilities } from "../../card.interface";
import { CardAbility } from "../card-ability";
import { CardConditions } from "../card-conditions";
import { CardType } from "../../enums/card-type";
import { CardHasher } from "../../services/card-hasher";

export class Card implements CardInterface {
  name: string;
  id: string;
  type: CardType;
  rarity: CardRarity;
  abilities?: CardAbility[];
  cost?: number;
  hash?: string;
  conditions: CardConditions;

  constructor(rarity: CardRarity, type: CardType, abilities?: CardAbility[], cost?: number, cardName?: string, cardId?: string, cardHash?: string) {
    this.type = type;
    this.rarity = rarity;
    if (abilities) {
      this.abilities = abilities;
    } else {
      this.abilities = [];
    }
    this.name = cardName;
    this.id = cardId;
    this.cost = cost;
    this.conditions = new CardConditions();
    if (cardHash) {
      this.hash = cardHash;
    } else {
      this.hash = CardHasher.getCardHash(this);
    }
  }

  toString(): string {
    return this.name + "::" + this.id;
  }

  hasAbility(id: string): boolean {
    for (let ability of this.abilities) {
      if (ability.id == id) {
        return true;
      }
    }
    return false;
  }

  getAbility(id: string): CardAbility {
    for (let ability of this.abilities) {
      if (ability.id == id) {
        return ability;
      }
    }
    throw new Error(`card does not have the ability ${id}`);
  }

  clearConditions() {
    this.conditions = new CardConditions();
  }

  copy():Card {
    const card = new Card(this.rarity, this.type, copyCardAbilities(this.abilities), this.cost, this.name, this.id, this.hash);
    card.conditions = this.conditions.copy();
    return card;
  }
}
