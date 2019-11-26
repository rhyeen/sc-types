import { CardInterface } from "../card.interface";
import { CardNameGenerator } from "./card-name-generator";
import { CardSet } from "../entities/card-set";
import { Card } from "../entities/card/card";
import { CardHasher } from "./card-hasher";

export class CardIdentifier {
  static generateCardName(card: CardInterface): string {
    if (card.name) {
      return card.name;
    }
    return CardNameGenerator.getRandomCardName(card);
  }

  static findCard(card: Card, cardSets: Record<string,CardSet>):Card {
    const hash = CardHasher.getCardHash(card);
    if (!(hash in cardSets)) {
      throw new Error(`card hash ${hash} does not exist within card sets`);
    }
    return cardSets[hash].getInstance(card.id);
  }
}
