import { CardInterface } from "../card.interface";
import { CardType } from "../enums/card-type";
import { CardRarity } from "../enums/card-rarity";

export class CardNameGenerator {
  static getRandomCardName(card: CardInterface): string {
    const cardNameClauses = this.getNameClauses(card);
    const cardNameClause = this.getRandomCardNameClause(cardNameClauses);
    let cardNameParts = [];
    for (let i = 0; i < cardNameClause.length; i++) {
      cardNameParts.push(this.getRandomCardNamePart(cardNameClause[i]));
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
                ['Goblin', 'Peasant', 'Skeleton'],
                ['Scavenger', 'Soldier', 'Cultist']
              ],
              [
                ['Herald', 'Bearer', 'Warden', 'Vagabond'],
                ['of'],
                ['Doom', 'Glory', 'Fame']
              ]
            ];
          case (CardRarity.Rare):
            return [
              [
                ['Orcish', 'Noble', 'Zombie'],
                ['Archer', 'Knight', 'Novice']
              ]
            ];
          case (CardRarity.Epic):
            return [
              [
                ['Troll', 'Veteran', 'Demon'],
                ['Ranger', 'Battlemaster', 'Mage']
              ]
            ];
          case (CardRarity.Legendary):
            return [
              [
                ['Giant', 'Godsent', 'Lich'],
                ['Shadow Archer', 'Leader', 'Archmagi']
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
                ['Trinket', 'Charm'],
                ['of'],
                ['Healing', 'Light', 'Spark']
              ]
            ];
          case (CardRarity.Rare):
            return [
              [
                ['Potion', 'Scroll'],
                ['of'],
                ['Restoration', 'Glimmer', 'Storm']
              ]
            ];
          case (CardRarity.Epic):
            return [
              [
                ['Tome', 'Artifact'],
                ['of'],
                ['Revival', 'Lightburst', 'Lightning']
              ]
            ];
          case (CardRarity.Legendary):
            return [
              [
                ['Relic', 'Blessing'],
                ['of'],
                ['Immortality', 'Suntorch', 'Skyfall']
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

