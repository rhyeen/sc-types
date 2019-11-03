import { CardInterface } from "../card.interface";
import { CardType } from "../enums/card-type";
import { CardRarity } from "../enums/card-rarity";
import { CardAbility, VariableCardAbility } from "../entities/card-ability";
import { StaticCardAbilityId, VariableCardAbilityId } from "../enums/card-ability";
export class CardHasher {
  
  private static NEGATIVE_HASH_NUMBERS = '0abcdefghijklmnopqrstuvwxyz-';
  private static POSITIVE_HASH_NUMBERS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ+';

  static getCardHash(card: CardInterface): string {
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
    if (card.hash) {
      return card.hash;
    }
    let hash = "";
    hash += this.getCardHashType(card.type);
    hash += this.getCardHashRarity(card.rarity);
    hash += this.getCardHashNumber(card.health);
    hash += this.getCardHashNumber(card.attack);
    hash += this.getCardHashNumber(card.range);
    if (card.abilities && card.abilities.length) {
      hash += "|A";
      for (let ability of card.abilities) {
        hash += this.getCardHashAbility(ability);
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
    if (!value) {
      return '0';
    }
    if (value < 0) {
      value = value * -1;
      if (value >= this.NEGATIVE_HASH_NUMBERS.length) {
        return this.NEGATIVE_HASH_NUMBERS[this.NEGATIVE_HASH_NUMBERS.length - 1];
      }
      return this.NEGATIVE_HASH_NUMBERS[value];
    }
    if (value >= this.POSITIVE_HASH_NUMBERS.length) {
      return this.POSITIVE_HASH_NUMBERS[this.POSITIVE_HASH_NUMBERS.length - 1];
    }
    return this.POSITIVE_HASH_NUMBERS[value];
  }

  private static getCardHashAbility(ability: CardAbility): string {
    let abilityAmount = "";
    if (ability instanceof VariableCardAbility) {
      abilityAmount = this.getCardHashNumber(ability.amount);
    }
    return ';' + this.getAbilityHashId(ability.id) + abilityAmount;
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
}
