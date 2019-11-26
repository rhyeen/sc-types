import { CardSet } from '../entities/card-set';
import { Card } from '../entities/card/card';

enum CardHashes {
  Energize = 'foobar',
}

export class CardFinder {
  static getEnergizeCard(cardSets: Record<string, CardSet>):Card {
    const cardSet = cardSets[CardHashes.Energize];
    if (!cardSet) {
      throw new Error(`cardSets does not contain hash for energerize`);
    }
    return cardSet.getInstances()[0];
  }
}