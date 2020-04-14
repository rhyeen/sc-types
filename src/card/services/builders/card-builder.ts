import { Card } from "../../entities/card/card";
import { CardInterface } from "../../card.interface";
import { CardType } from "../../enums/card-type";
import { MinionCard } from "../../entities/card/minion-card";
import { SpellCard } from "../../entities/card/spell-card";
import { CardAbility, CardAbilityEnergize, CardAbilityHaste, CardAbilityReach, CardAbilitySpellshot } from "../../entities/card-ability";
import { StaticCardAbilityId, VariableCardAbilityId } from "../../enums/card-ability";
import { EliteState } from "../../entities/elite-state";

export class CardBuilder {
  static buildCardInterface(cardData: any):CardInterface {
    if (!cardData) {
      throw new Error('param cardData is not initialized');
    }
    const abilities = CardBuilder.buildCardAbilities(cardData.abilities);
    const eliteState = CardBuilder.buildEliteState(cardData.eliteState);
    return {
      name: cardData.name,
      id: cardData.id,
      type: cardData.type,
      rarity: cardData.rarity,
      hash: cardData.hash,
      abilities,
      cost: cardData.cost,
      health: cardData.health,
      range: cardData.range,
      attack: cardData.attack,
      level: cardData.level,
      eliteState,
    };
  }

  static buildCard(cardData: any):Card {
    return CardBuilder.getTypedCard(CardBuilder.buildCardInterface(cardData));
  }

  static buildCardAbilities(cardAbilitiesData: any):CardAbility[] {
    const result = [];
    if (!cardAbilitiesData || !cardAbilitiesData.length) {
      return result;
    }
    for (const cardAbilityData of cardAbilitiesData) {
      result.push(CardBuilder.buildCardAbility(cardAbilityData));
    }
    return result;
  }

  static buildCardAbility(cardAbilityData: any):CardAbility {
    let _amount = 0;
    if (cardAbilityData.amount) {
      _amount = cardAbilityData.amount;
    }
    switch (cardAbilityData.id) {
      case StaticCardAbilityId.Haste:
        return new CardAbilityHaste();
      case VariableCardAbilityId.Energize:
        return new CardAbilityEnergize(_amount);
      case VariableCardAbilityId.Reach:
        return new CardAbilityReach(_amount);
      case VariableCardAbilityId.Spellshot:
        return new CardAbilitySpellshot(_amount);
      default:
        throw new Error(`unexpected ability id: ${cardAbilityData.id}`);
    }
  }

  static getTypedCard(card: CardInterface, cardId?: string):Card {
    let _cardId = card.id;
    if (cardId) {
      _cardId = cardId;
    }
    let typedCard:Card;
    if (card.type === CardType.Minion) {
      typedCard = new MinionCard(card.rarity, card.health, card.attack, card.range, card.abilities, card.cost, card.name, _cardId, card.hash);
    } else {
      typedCard = new SpellCard(card.rarity, card.abilities, card.cost, card.name, _cardId, card.hash);
    }
    if (card.level) {
      typedCard.level = card.level;
    }
    return typedCard;
  }

  static buildEliteState(eliteStateData?: any):EliteState | undefined {
    if (!eliteStateData) {
      return undefined;
    }
    return new EliteState(
      eliteStateData.turnsUntilElite,
      eliteStateData.turnsUntilExplode,
      eliteStateData.appliedEliteState,
      eliteStateData.turnCounter,
      CardBuilder.buildCardAbilities(eliteStateData.extraAbilities),
      CardBuilder.buildCardAbilities(eliteStateData.explodeAbilities),
      eliteStateData.extraHealth,
      eliteStateData.extraAttack,
      eliteStateData.extraRange,
    );
  }
}