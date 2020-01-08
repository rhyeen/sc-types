import { CardInterface } from "../card.interface";
import { CardType } from "../enums/card-type";
import { CardRarity } from "../enums/card-rarity";

const MAX_ITERATIONS = 100;

export class CardNameGenerator {
  static getRandomCardNames(card: CardInterface, maxNumberOfNames: number): Set<string> {
    const names = new Set<string>();
    let iterations = 0;
    while (names.size < maxNumberOfNames && iterations < MAX_ITERATIONS) {
      iterations += 1;
      names.add(CardNameGenerator.getRandomCardName(card));
    }
    return names;
  }

  static getRandomCardName(card: CardInterface): string {
    const cardNameClauses = this.getNameClauses(card);
    const cardNameClause = this.getRandomCardNameClause(cardNameClauses);
    const cardNameParts = [];
    for (const _cardNameParts of cardNameClause) {
      cardNameParts.push(this.getRandomCardNamePart(_cardNameParts));
    }
    return cardNameParts.join(' ');
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

  private static getRandomCardNameClause(cardNameClauses: string[][][]): string[][] {
    return this.getRandomArrayElement(cardNameClauses);
  }

  private static getRandomCardNamePart(cardNamePart: string[]): string {
    return this.getRandomArrayElement(cardNamePart);
  }

  private static getRandomArrayElement(arr: any[]): any {
    return arr[Math.floor((Math.random() * arr.length))];
  }
}

