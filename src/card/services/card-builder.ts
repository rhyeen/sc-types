import { Card } from "../entities/card/card";
import { CardInterface } from "../card.interface";
import { CardType } from "../enums/card-type";
import { MinionCard } from "../entities/card/minion-card";
import { SpellCard } from "../entities/card/spell-card";
import { CardAbility, CardAbilityEnergize, CardAbilityHaste, CardAbilityReach, CardAbilitySpellshot } from "../entities/card-ability";
import { StaticCardAbilityId, VariableCardAbilityId } from "../enums/card-ability";

export class CardBuilder {
  static buildCard(cardData: any):Card {
    if (!cardData) {
      throw new Error('param cardData is not initialized');
    }
    const abilities = CardBuilder.buildCardAbilities(cardData.abilities);
    const card = {
      name: cardData.name,
      id: cardData.id,
      type: cardData.type,
      rarity: cardData.rarity,
      hash: cardData.hash,
      abilities: abilities,
      cost: cardData.cost,
      health: cardData.health,
      range: cardData.range,
      attack: cardData.attack
    };
    return CardBuilder.getTypedCard(card);
  }

  static buildCardAbilities(cardAbilitiesData:  any): CardAbility[] {
    const result = [];
    if (!cardAbilitiesData || !cardAbilitiesData.length) {
      return result;
    }
    for (const cardAbilityData of cardAbilitiesData) {
      result.push(CardBuilder.buildCardAbility(cardAbilityData.id, cardAbilityData.amount));
    }
    return result;
  }

  static buildCardAbility(abilityId: string, amount?: number): CardAbility {
    let _amount = 0;
    if (amount) {
      _amount = amount;
    }
    switch(abilityId) {
      case StaticCardAbilityId.Haste:
        return new CardAbilityHaste();
      case VariableCardAbilityId.Energize:
        return new CardAbilityEnergize(_amount);
      case VariableCardAbilityId.Reach:
        return new CardAbilityReach(_amount);
      case VariableCardAbilityId.Spellshot:
        return new CardAbilitySpellshot(_amount);
      default:
        throw new Error(`unexpected ability id: ${abilityId}`);
    }
  }

  static getTypedCard(card: CardInterface, cardId?: string):Card {
    let _cardId = card.id;
    if (cardId) {
      _cardId = cardId;
    }
    if (card.type == CardType.Minion) {
      return new MinionCard(card.rarity, card.health, card.attack, card.range, card.abilities, card.cost, card.name, cardId, card.hash);
    } else {
      return new SpellCard(card.rarity, card.abilities, card.cost, card.name, cardId, card.hash);
    }
  }
}