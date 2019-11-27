import { Dungeon } from "../../entities/dungeon";
import { CardSet } from "../../../card/entities/card-set";
import { DungeonFieldSlot } from "../../entities/field-slot";
import { CardRarity } from "../../../card/enums/card-rarity";
import { Card } from "../../../card/entities/card/card";
import { CardBuilder } from "../../../card/services/card-builder";

export class DungeonGenerator {
  static generateDungeon(dungeonSeed: any, cardSets: Record<string, CardSet>):Dungeon {
    const dungeonField = [
      DungeonGenerator.getDungeonFieldSlot(dungeonSeed, cardSets, 0),
      DungeonGenerator.getDungeonFieldSlot(dungeonSeed, cardSets, 1),
      DungeonGenerator.getDungeonFieldSlot(dungeonSeed, cardSets, 2),
    ];
    return new Dungeon(dungeonField);
  }

  private static getDungeonFieldSlot(dungeonSeed: any, cardSets: Record<string, CardSet>, fieldSlotIndex: number):DungeonFieldSlot {
    const backlog = [];
    backlog.push(...DungeonGenerator.getBacklogPartitionByRarity(CardRarity.Common, dungeonSeed, cardSets, fieldSlotIndex));
    backlog.push(...DungeonGenerator.getBacklogPartitionByRarity(CardRarity.Rare, dungeonSeed, cardSets, fieldSlotIndex));
    backlog.push(...DungeonGenerator.getBacklogPartitionByRarity(CardRarity.Epic, dungeonSeed, cardSets, fieldSlotIndex));
    backlog.push(...DungeonGenerator.getBacklogPartitionByRarity(CardRarity.Legendary, dungeonSeed, cardSets, fieldSlotIndex));
    const initialCard = backlog.shift();
    return new DungeonFieldSlot(initialCard, backlog);
  }

  // @MUTATES: cardSets
  private static getBacklogPartitionByRarity(rarity: CardRarity, dungeonSeed: any, cardSets: Record<string, CardSet>, fieldSlotIndex: number):Card[] {
    const partition = [];
    const maxNumberOfCards = dungeonSeed.field[fieldSlotIndex].backlogPartitions[rarity].size;
    const levelIncreaseChance = dungeonSeed.field[fieldSlotIndex].levelIncreaseChance;
    const cardSetsByLevel = DungeonGenerator.getCardSetsByLevel(rarity, dungeonSeed, cardSets);
    if (!cardSetsByLevel.length) {
      return partition;
    }
    while (maxNumberOfCards > partition.length) {
      const levelIndex = DungeonGenerator.getIndexLevel(maxNumberOfCards, partition.length, cardSetsByLevel.length, levelIncreaseChance);
      const cardSet = DungeonGenerator.getRandomCardSet(cardSetsByLevel[levelIndex]);
      partition.push(cardSet.createInstance());
    }
    return partition;
  }

  private static getIndexLevel(maxNumberOfCards: number, currentNumberOfCards: number, numberOfLevels: number, levelIncreaseChance: number):number {
    const cardsPerLevel = Math.ceil(maxNumberOfCards / numberOfLevels);
    let levelIndex = Math.floor(currentNumberOfCards / cardsPerLevel);
    while(
      levelIndex < numberOfLevels - 1 &&
      DungeonGenerator.increaseLevelIndex(levelIncreaseChance)
    ) {
      levelIndex += 1;
    }
    return levelIndex;
  }

  private static increaseLevelIndex(levelIncreaseChance: number):boolean {
    return Math.random() <= levelIncreaseChance;
  }

  private static getRandomCardSet(cardSets: CardSet[]):CardSet {
    return cardSets[Math.floor(Math.random() * cardSets.length)];
  }
  
  private static getCardSetsByLevel(rarity: CardRarity, dungeonSeed: any, cardSets: Record<string, CardSet>):CardSet[][] {
    let cardSetsOfRarity = DungeonGenerator.extractCardSetsByRarity(rarity, dungeonSeed.dungeonCards, cardSets);
    if (!cardSetsOfRarity.length) {
      return [];
    }
    cardSetsOfRarity = cardSetsOfRarity.sort((a, b) => {
      return a.baseCard.level - b.baseCard.level;
    });
    const cardSetsByLevel = [[]];
    let currentLevel = cardSetsOfRarity[0].baseCard.level;
    for (const cardSet of cardSetsOfRarity) {
      if (cardSet.baseCard.level !== currentLevel) {
        cardSetsByLevel.push([]);
        currentLevel = cardSet.baseCard.level;
      }
      cardSetsByLevel[cardSetsByLevel.length - 1].push(cardSet);
    }
    return cardSetsByLevel;
  }

  private static extractCardSetsByRarity(rarity: CardRarity, cardsData: any[], cardSets: Record<string, CardSet>):CardSet[] {
    const cardSetsFromData = [];
    for (const cardData of cardsData) {
      if (cardData.rarity != rarity) {
        continue;
      }
      let hash = cardData.hash;
      if (!hash) {
        hash = CardBuilder.buildCard(cardData).hash;
      }
      cardSetsFromData.push(cardSets[hash]);
    }
    return cardSetsFromData;
  }
}