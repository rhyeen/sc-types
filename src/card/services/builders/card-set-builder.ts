import { CardSet } from "../../entities/card-set";
import { Card } from "../../entities/card/card";
import { CardBuilder } from "./card-builder";

export class CardSetBuilder {
  static buildCardSets(cardSetsData: Record<string,any>):Record<string,CardSet> {
    const cardSets = {};
    for (const hash in cardSetsData) {
      cardSets[hash] = CardSetBuilder.buildCardSet(cardSetsData[hash]);
    }
    return cardSets;
  }

  static buildCardSet(cardSetData: any):CardSet {
    const instances = CardSetBuilder.buildInstances(cardSetData.baseCard, cardSetData.instances);
    const cardSet = new CardSet(CardBuilder.buildCardInterface(cardSetData.baseCard)); 
    for (const instance of instances) {
      cardSet.setInstance(instance);
    }
    return cardSet;
  }

  private static buildInstances(baseCardData: any, instancesData: any):Card[] {
    const cards = [];
    for (const cardId in instancesData) {
      cards.push(CardBuilder.buildCard({ ...baseCardData, ...instancesData[cardId] }));
    }
    return cards;
  }
}