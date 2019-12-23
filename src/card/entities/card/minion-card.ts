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

  exhaust() {
    this.conditions.exhausted = true;
  }

  hasHaste(): boolean {
    return this.hasAbility(StaticCardAbilityId.Haste);
  }

  // @NOTE: this does not exhaust the attacking card because it could
  // be due to a retaliate.  The turn-action should handle the exhaustion.
  attackCard(attackedCard: MinionCard) {
    let attack = this.attack;
    if (attackedCard.conditions.shield) {
      if (attackedCard.conditions.shield > attack) {
        attackedCard.conditions.shield -= attack;
      } else {
        attack -= attackedCard.conditions.shield;
        attackedCard.conditions.shield = 0;
      }
    }
    attackedCard.health -= attack;
  }

  attackPlayerDamage():number {
    return this.attack;
  }

  copy():Card {
    const card = new MinionCard(this.rarity, this.health, this.attack, this.range, copyCardAbilities(this.abilities), this.cost, this.name, this.id, this.hash);
    card.conditions = this.conditions.copy();
    return card;
  }
}