import { Card } from "./card";
import { StaticCardAbilityId } from "../../enums/card-ability";
import { CardType } from "../../enums/card-type"
import { CardRarity } from "../../enums/card-rarity";
import { CardAbility } from "../card-ability";
import { copyCardAbilities } from "../../card.interface";

export class MinionCard extends Card {
  health: number;
  attack: number;
  range: number;

  constructor(rarity: CardRarity, health: number, attack: number, range: number, abilities?: CardAbility[], cost?: number, cardName?: string, cardId?: string, cardHash?: string) {
    super(rarity, CardType.Minion, abilities, cost, cardName, cardId, cardHash);
    this.health = health;
    this.attack = attack;
    this.range = range;
  }

  isDead(): boolean {
    return this.health <= 0;
  }

  isExhausted(): boolean {
    return !!this.conditions.exhausted;
  }

  hasHaste(): boolean {
    return this.hasAbility(StaticCardAbilityId.Haste);
  }

  copy():Card {
    const card = new MinionCard(this.rarity, this.health, this.attack, this.range, copyCardAbilities(this.abilities), this.cost, this.name, this.id, this.hash);
    card.conditions = this.conditions.copy();
    return card;
  }
}