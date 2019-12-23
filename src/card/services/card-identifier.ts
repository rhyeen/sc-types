import { CardSet } from '../entities/card-set';
import { Card } from '../entities/card/card';
import { CardInterface } from '../card.interface';
import { CardNameGenerator } from './card-name-generator';

enum CardHashes {
  Energize = 'SS000|A;EN1',
}

const StartingHandCardHashes = new Set();
StartingHandCardHashes.add(CardHashes.Energize);

export class CardIdentifier {
  static generateCardName(card: CardInterface): string {
    if (card.name) {
      return card.name;
    }
    return CardNameGenerator.getRandomCardName(card);
  }

  static getEnergizeCard(cardSets: Record<string, CardSet>):Card {
    const cardSet = cardSets[CardHashes.Energize];
    if (!cardSet) {
      throw new Error(`cardSets does not contain hash for energerize`);
    }
    return cardSet.getInstances()[0];
  }

  static isStartingHandCard(card: Card):boolean {
    return StartingHandCardHashes.has(card.hash);
  }
}