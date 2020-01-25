import { CardInterface } from "../card.interface";
import { CardType } from "../enums/card-type";
import { CardRarity } from "../enums/card-rarity";
import { CardAbility, VariableCardAbility, CardAbilityHaste, CardAbilityReach, CardAbilitySpellshot, CardAbilityEnergize } from "../entities/card-ability";
import { StaticCardAbilityId, VariableCardAbilityId } from "../enums/card-ability";
export class CardHasher {
  
  private static NEGATIVE_HASH_NUMBERS = '0abcdefghijklmnopqrstuvwxyz-';
  private static POSITIVE_HASH_NUMBERS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ+';
  
  static getCardHash(card: CardInterface, ignoreCurrentHash?: true): string {
    /*
    [0]: TYPE: M=MINION | S=SPELL
    [1]: RARITY: C=COMMON | R=RARE | E=EPIC | U=UNDEFINED | L=LEGENDARY | S=STANDARD
    [2]: HEALTH: 1-Z
    [3]: ATTACK: 1-Z
    [4]: RANGE: 1-Z
    [5-7]: |A
    [8+]: ABILITIES:
      [X]: ;
      [X+1-X+2]: ABILITY ID: XY
      [X+3]: ABILITY AMOUNT: 1-Z
    */
    if (card.hash && !ignoreCurrentHash) {
      return card.hash;
    }
    let hash = "";
    hash += CardHasher.getCardHashType(card.type);
    hash += CardHasher.getCardHashRarity(card.rarity);
    hash += CardHasher.getCardHashNumber(card.health);
    hash += CardHasher.getCardHashNumber(card.attack);
    hash += CardHasher.getCardHashNumber(card.range);
    if (card.abilities && card.abilities.length) {
      hash += "|A";
      for (const ability of card.abilities) {
        hash += CardHasher.getCardHashAbility(ability);
      }
    }
    return hash;
  }


  private static getCardHashType(cardType: CardType): string {
    switch(cardType) {
      case CardType.Minion:
        return 'M';
      case CardType.Spell:
        return 'S';
      default:
        throw new Error(`unexpected card type: ${cardType}`);
    }
  }

  private static getCardHashRarity(cardRarity: CardRarity): string {
    switch(cardRarity) {
      case CardRarity.Common:
        return 'C';
      case CardRarity.Rare:
        return 'R';
      case CardRarity.Epic:
        return 'E';
      case CardRarity.Legendary:
        return 'L';
      case CardRarity.Standard:
        return 'S';
      case CardRarity.Undefined:
        return 'U';
      default:
        throw new Error(`unexpected card rarity: ${cardRarity}`);
    }
  }

  private static getCardHashNumber(value: number): string {
    let _value = value;
    if (!_value) {
      return '0';
    }
    if (_value < 0) {
      _value = _value * -1;
      if (_value >= CardHasher.NEGATIVE_HASH_NUMBERS.length) {
        return CardHasher.NEGATIVE_HASH_NUMBERS[CardHasher.NEGATIVE_HASH_NUMBERS.length - 1];
      }
      return CardHasher.NEGATIVE_HASH_NUMBERS[_value];
    }
    if (_value >= CardHasher.POSITIVE_HASH_NUMBERS.length) {
      return CardHasher.POSITIVE_HASH_NUMBERS[CardHasher.POSITIVE_HASH_NUMBERS.length - 1];
    }
    return CardHasher.POSITIVE_HASH_NUMBERS[_value];
  }

  private static getCardHashAbility(ability: CardAbility): string {
    let abilityAmount = "";
    if (ability instanceof VariableCardAbility) {
      abilityAmount = CardHasher.getCardHashNumber(ability.amount);
    }
    return ';' + CardHasher.getAbilityHashId(ability.id) + abilityAmount;
  }

  private static getAbilityHashId(abilityId: string): string {
    switch(abilityId) {
      case StaticCardAbilityId.Haste:
        return 'HS';
      case VariableCardAbilityId.Reach:
        return 'RC';
      case VariableCardAbilityId.Spellshot:
        return 'SS';
      case VariableCardAbilityId.Energize:
        return 'EN';
      default:
        throw new Error(`unexpected ability id: ${abilityId}`);
    }
  }

  static getCard(cardHash: string): CardInterface {
    const card = <CardInterface>{
      hash: cardHash,
      type: CardHasher.getCardType(cardHash),
      rarity: CardHasher.getCardRarity(cardHash),
      abilities: CardHasher.getCardAbilities(cardHash)
    };
    if (card.type === CardType.Minion) {
      card.health = CardHasher.getCardStatNumber(cardHash, 2);
      card.attack = CardHasher.getCardStatNumber(cardHash, 3);
      card.range = CardHasher.getCardStatNumber(cardHash, 4);
    }
    return card;
  }

  private static getCardType(cardHash: string): CardType {
    const cardTypeChar = cardHash[0];
    switch(cardTypeChar) {
      case 'M':
        return CardType.Minion;
      case 'S':
        return CardType.Spell;
      default:
        throw new Error(`unexpected card type for hash: ${cardHash}`);
    }
  }

  private static getCardRarity(cardHash: string): CardRarity {
    const cardRarityChar = cardHash[1];
    switch(cardRarityChar) {
      case 'C':
        return CardRarity.Common;
      case 'R':
        return CardRarity.Rare;
      case 'E':
        return CardRarity.Epic;
      case 'L':
        return CardRarity.Legendary;
      case 'S':
        return CardRarity.Standard;
      case 'U':
        return CardRarity.Undefined;
      default:
        throw new Error(`unexpected card rarity for hash: ${cardHash}`);
    }
  }

  private static getCardAbilities(cardHash: string):CardAbility[] {
    const result = [];
    if (cardHash.length < 'TRHAR|A;XY'.length) {
      return result;
    }
    const cardParts = cardHash.split('|A');
    if (cardParts.length <= 1) {
      return result;
    }
    const cardAbilityParts = cardParts[1].split(';');
    for (const cardAbilityPart of cardAbilityParts) {
      if (!cardAbilityPart) {
        continue;
      }
      const abilityId = cardAbilityPart.substring(0, 2);
      let abilityAmount = 0;
      if (cardAbilityPart.length > 2) {
        abilityAmount = CardHasher.getCardStatNumber(cardAbilityPart, 2);
      }
      result.push(CardHasher.getCardAbility(abilityId, abilityAmount));
    }
    return result;
  }

  private static getCardAbility(abilityId: string, abilityAmount: number): CardAbility {
    switch(abilityId) {
      case 'HS':
        return new CardAbilityHaste();
      case 'RC':
        return new CardAbilityReach(abilityAmount);
      case 'SS':
        return new CardAbilitySpellshot(abilityAmount);
      case 'EN':
        return new CardAbilityEnergize(abilityAmount);
      default:
        throw new Error(`unexpected hashed ability id: ${abilityId}`);
    }
  }

  private static getCardStatNumber(cardHash: string, numberIndexInHash: number): number {
    if (cardHash.length <= numberIndexInHash) {
      return 0;
    }
    const numberChar = cardHash[numberIndexInHash];
    if (numberChar === '0') {
      return 0;
    }
    let index = this.POSITIVE_HASH_NUMBERS.indexOf(numberChar);
    if (index > 0) {
      return index;
    }
    index = this.NEGATIVE_HASH_NUMBERS.indexOf(numberChar);
    if (index > 0) {
      return index * -1;
    }
    throw new Error(`card hash: ${cardHash} at index: ${numberIndexInHash} is not a valid stat number`);
  }
}
