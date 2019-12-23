import { PlayerHand, PlayerDiscardDeck, PlayerLostDeck, PlayerDrawDeck, HiddenPlayerDrawDeck } from "../../entities/player/deck";
import { CardSet } from "../../../card/entities/card-set";
import { Card } from "../../../card/entities/card/card";
import { CardFinder } from "../../../card/services/card-finder";

export class DeckBuilder {
  static buildPlayerHand(playerHandData: any, cardSets: Record<string, CardSet>):PlayerHand {
    const cards = DeckBuilder.buildCards(playerHandData.cards, cardSets);
    return new PlayerHand(playerHandData.refillSize, cards);
  }

  private static buildCards(cardsData: any[], cardSets: Record<string, CardSet>):Card[] {
    if (!cardsData || !cardsData.length) {
      return null;
    }
    const cards = [];
    for (const card of cardsData) {
      cards.push(CardFinder.findCardFromIds(card.id, card.hash, cardSets));
    }
    return cards;
  }

  static buildPlayerDrawDeck(drawDeckData: any, cardSets: Record<string, CardSet>):PlayerDrawDeck {
    const cards = DeckBuilder.buildCards(drawDeckData.cards, cardSets);
    if (drawDeckData.size || drawDeckData.size === 0) {
      return new HiddenPlayerDrawDeck(drawDeckData.size);
    }
    return new PlayerDrawDeck(cards);
  }

  static buildPlayerDiscardDeck(discardDeckData: any, cardSets: Record<string, CardSet>):PlayerDiscardDeck {
    const cards = DeckBuilder.buildCards(discardDeckData.cards, cardSets);
    return new PlayerDiscardDeck(cards);
  }

  static buildPlayerLostDeck(lostDeckData: any, cardSets: Record<string, CardSet>):PlayerLostDeck {
    const cards = DeckBuilder.buildCards(lostDeckData.cards, cardSets);
    return new PlayerLostDeck(cards);
  }
}