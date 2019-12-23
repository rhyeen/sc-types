import { CardSet } from "../entities/card-set";
import { Card } from "../entities/card/card";
import { CardHasher } from "./card-hasher";

export class CardFinder {
  static findCard(card: Card, cardSets: Record<string,CardSet>):Card {
    const hash = CardHasher.getCardHash(card);
    return CardFinder.findCardFromIds(card.id, hash, cardSets);
  }

  static findCardFromIds(cardId: string, cardHash: string, cardSets: Record<string,CardSet>):Card {
    if (!(cardHash in cardSets)) {
      throw new Error(`card hash ${cardHash} does not exist within card sets`);
    }
    return cardSets[cardHash].getInstance(cardId);
  }
}
