import { CardInterface } from "../card.interface";
import { CardType } from "../enums/card-type";
import { CardRarity } from "../enums/card-rarity";

const MAX_ITERATIONS = 100;

interface SelectedClause {
  index: number;
  clause: string[][];
}

interface SelectedPart {
  index: number;
  part: string;
}

interface SelectedElement {
  index: number;
  element: any;
}

export class CardNameBuilder {
  buildCardName(cardNameData: any):CardName {
    return new CardName(cardNameData.id, cardNameData.name);
  }
}

export class CardName {
  _id: string;
  _name: string;

  constructor(id: string, name: string) {
    this._id = id;
    this._name = name;
  }

  json():any {
    return {
      id: this.id,
      name: this.name,
    };
  }

  static generateCardName(possibleClauses: string[][][]): CardName {
    const selectedClause = CardName.getRandomCardNameClause(possibleClauses);
    const cardNameParts = [];
    for (const _cardNameParts of selectedClause.clause) {
      cardNameParts.push(CardName.getRandomCardNamePart(_cardNameParts));
    }
    const id = selectedClause.index + ":" + cardNameParts.map(part => part.index).join('|');
    const name = cardNameParts.map(part => part.part).join(' ');
    return new CardName(id, name);
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  private static getRandomCardNameClause(cardNameClauses: string[][][]): SelectedClause {
    const { index, element } = this.getRandomArrayElement(cardNameClauses);
    return { index, clause: element };
  }

  private static getRandomCardNamePart(cardNamePart: string[]): SelectedPart {
    const { index, element } = this.getRandomArrayElement(cardNamePart);
    return { index, part: element };
  }

  private static getRandomArrayElement(arr: any[]): SelectedElement {
    const index = Math.floor((Math.random() * arr.length));
    const element = arr[index];
    return { index, element };
  }
}

export class CardNameGenerator {
  static getRandomCardNames(card: CardInterface, maxNumberOfNames: number): Set<CardName> {
    const names = new Set<CardName>();
    let iterations = 0;
    while (names.size < maxNumberOfNames && iterations < MAX_ITERATIONS) {
      iterations += 1;
      names.add(CardNameGenerator.getRandomCardName(card));
    }
    return names;
  }

  static getRandomCardName(card: CardInterface): CardName {
    const cardNameClauses = this.getNameClauses(card);
    return CardName.generateCardName(cardNameClauses);
  }

  static isValidName(card: CardInterface, name: CardName): boolean {
    try {
      CardNameGenerator.checkName(card, name);
      return true;
    } catch {
      return false;
    }
  }

  static checkName(card: CardInterface, cardName: CardName) {
    let parts = cardName.id.split(':');
    if (parts.length !== 2) {
      throw new Error(`expecting a single ':' inside id: ${cardName.id}`);
    }
    const clauseIndex = parseInt(parts[0]);
    const clauses = CardNameGenerator.getNameClauses(card);
    if (clauseIndex < 0 || clauseIndex >= clauses.length) {
      throw new Error(`expecting clause index: ${clauseIndex} to be between 0 and ${clauses.length}`);
    }
    const clause = clauses[clauseIndex];
    parts = parts[1].split('|');
    if (parts.length !== clause.length) {
      throw new Error(`expecting the number of elements split by | to be ${clause.length} for id: ${cardName.id}`);
    }
    const nameParts = [];
    for (let i = 0; i < clause.length; i++) {
      const partIndex = parseInt(parts[i]);
      if (partIndex < 0 || partIndex >= clause[i].length) {
        throw new Error(`expecting part index: ${partIndex} to be between 0 and ${clause[i].length} for part: ${i}`);
      }
      nameParts.push(clause[i][partIndex]);
    }
    const actualName = nameParts.join(' ');
    if (actualName !== cardName.name) {
      throw new Error(`the cardName.id of:${cardName.id} points to the name: ${actualName} but the name: ${cardName.name} was given`);
    }
  }

  private static getNameClauses(card: CardInterface): string[][][] {
    switch(card.type) {
      case (CardType.Minion):
        switch(card.rarity) {
          case (CardRarity.Common):
            return [
              [
                ['Goblin', 'Peasant', 'Skeleton', 'Imp', 'Common', 'Exciled', 'Blundering', 'Drunken'],
                ['Scavenger', 'Soldier', 'Cultist', 'Gardener', 'Watch', 'Patrol', 'Recruit']
              ],
              [
                ['Herald', 'Bearer', 'Warden', 'Vagabond', 'Keeper', 'Flame', 'Ward'],
                ['of Fleeting', 'of Little', 'of Minor'],
                ['Doom', 'Glory', 'Fame', 'Fortune', 'Twilight', 'Shade']
              ]
            ];
          case (CardRarity.Rare):
            return [
              [
                ['Orcish', 'Noble', 'Zombie', 'Skilled', 'Undead', 'Mystic'],
                ['Archer', 'Knight', 'Novice', 'Thief', 'Underlord']
              ]
            ];
          case (CardRarity.Epic):
            return [
              [
                ['Troll', 'Veteran', 'Demonic', 'Honed', 'Expert', 'Retired'],
                ['Ranger', 'Battlemaster', 'Mage', 'Rogue', 'Mastermind', 'Prince', 'Princess']
              ]
            ];
          case (CardRarity.Legendary):
            return [
              [
                ['Giant', 'Godsent', 'Lich', 'Draconic', 'Ageless', 'The Blessed', 'The Cursed', 'Storm', 'Tempest'],
                ['Shadow Archer', 'Leader', 'Archmagi', 'King', 'Queen', 'Drake', 'Warlord']
              ]
            ];
          default:
            throw new Error(`unexpected card rarity: ${card.rarity}`);
        }
      case (CardType.Spell):
        switch(card.rarity) {
          case (CardRarity.Common):
            return [
              [
                ['Trinket', 'Charm', 'Locket', 'Comb', 'Bracelet', 'Token'],
                ['of', 'of Minor', 'of Wild'],
                ['Healing', 'Light', 'Spark', 'Poison', 'Blood', 'Ichor']
              ]
            ];
          case (CardRarity.Rare):
            return [
              [
                ['Potion', 'Scroll', 'Rune', 'Ward', 'Banner', 'Sigil', 'Ring', 'Amulet'],
                ['of', 'of Greater', 'of Chaotic'],
                ['Restoration', 'Glimmer', 'Storm', 'Necromancy', 'Rage', 'Silence']
              ]
            ];
          case (CardRarity.Epic):
            return [
              [
                ['Tome', 'Artifact', 'Shield', 'Sword', 'Axe', 'Halberd'],
                ['of', 'of Superior'],
                ['Revival', 'Lightburst', 'Lightning', 'Undeath', 'Rejuvenation', 'Warding']
              ]
            ];
          case (CardRarity.Legendary):
            return [
              [
                ['Relic', 'Blessing', 'Curse', 'Mark', 'Sign'],
                ['of', 'of Unimaginable'],
                ['Immortality', 'Suntorch', 'Skyfall', 'Soulpurge', 'Counterspell', 'Timelessness']
              ]
            ];
          default:
            throw new Error(`unexpected card rarity: ${card.rarity}`);
        }
      default:
        throw new Error(`unexpected card rarity: ${card.rarity}`);
    }
  }
}

