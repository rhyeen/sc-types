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
    return this.remainingHealth <= 0;
  }

  get remainingHealth():number {
    if (this.conditions.damage > this.health) {
      return 0;
    }
    return this.health - this.conditions.damage;
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
    attackedCard.conditions.damage += attack;
  }

  attackPlayerDamage():number {
    return this.attack;
  }

  copy():Card {
    const card = new MinionCard(this.rarity, this.health, this.attack, this.range, copyCardAbilities(this.abilities), this.cost, this.name, this.id, this.hash);
    card.conditions = this.conditions.copy();
    if (this.eliteState) {
      card.eliteState = this.eliteState.copy();
    }
    return card;
  }

  incrementTurnOnField() {
    if (this.eliteState) {
      this.eliteState.incrementTurn();
    }
    if (this.abilities) {
      this.abilities.forEach(ability => ability.incrementTurn());
    }
  }

  attemptApplyEliteState() {
    if (!this.eliteState) {
      return;
    }
    if (this.eliteState.appliedEliteState) {
      return;
    }
    if (!this.eliteState.readyForEliteState) {
      return;
    }
    this.eliteState.appliedEliteState = true;
    this.health += this.eliteState.extraHealth;
    this.range += this.eliteState.extraRange;
    this.attack += this.eliteState.extraAttack;
    if (!this.abilities) {
      this.abilities = [];
    }
    this.eliteState.extraAbilities.forEach(ability => this.abilities.push(ability));
  }
}