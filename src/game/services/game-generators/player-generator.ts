import { CardFinder } from '../../../card/services/card-finder';
import { CardSet } from '../../../card/entities/card-set';
import { Player } from '../../entities/player/player';
import { Relic } from '../../../items/entities/relic';
import { CardBuilder } from '../../../card/services/card-builder';
import { Card } from '../../../card/entities/card/card';

export class PlayerGenerator {
  static generatePlayer(dungeonSeed: any, playerContext: any, cardSets: Record<string, CardSet>):Player {
    const playerOwnedRelics = PlayerGenerator.extractRelics(playerContext);
    const maxHealth = PlayerGenerator.getPlayerMaxHealth(dungeonSeed, playerOwnedRelics);
    const maxEnergy = PlayerGenerator.getPlayerMaxEnergy(dungeonSeed, playerOwnedRelics);
    const handRefillSize = PlayerGenerator.getPlayerMaxHandRefillSize(dungeonSeed, playerOwnedRelics);
    const player = new Player(maxHealth, maxEnergy, handRefillSize);
    // @NOTE: All starting hand cards are put into draw deck and other cards into discard deck because when
    // the game begins, a hand will be drawn from the draw deck first, then the discard deck will be shuffled
    // into the draw deck and drawn from.
    // @TODO: add all player cards to discardDeck.
    const cards = PlayerGenerator.extractCards(playerContext.baseCards, cardSets);
    for (const card of cards) {
      if (CardFinder.isStartingHandCard(card)) {
        player.drawDeck.add(card);
      } else {
        player.discardDeck.add(card);
      }
    }
    return player;
  }

  private static extractCards(cardsData: any[], cardSets: Record<string, CardSet>):Card[] {
    const cards = [];
    for (const cardData of cardsData) {
      let hash = cardData.hash;
      if (!hash) {
        hash = CardBuilder.buildCard(cardData).hash;
      }
      cards.push(cardSets[hash].getInstance(cardData.id));
    }
    return cards;
  }

  private static extractRelics(playerContext: any):Relic[] {
    // @TODO:
    return [];
  }

  private static getPlayerMaxHealth(dungeonSeed: any, playerOwnedRelics: Relic[]):number {
    let modifier = 0;
    for (const relic of playerOwnedRelics) {
      modifier += relic.modifyPlayerMaxHealth();
    }
    return dungeonSeed.initial.player.health + modifier;
  }

  private static getPlayerMaxEnergy(dungeonSeed: any, playerOwnedRelics: Relic[]):number {
    let modifier = 0;
    for (const relic of playerOwnedRelics) {
      modifier += relic.modifyPlayerMaxEnergy();
    }
    return dungeonSeed.initial.player.energy + modifier;
  }

  private static getPlayerMaxHandRefillSize(dungeonSeed: any, playerOwnedRelics: Relic[]):number {
    let modifier = 0;
    for (const relic of playerOwnedRelics) {
      modifier += relic.modifyPlayerMaxHandRefillSize();
    }
    return dungeonSeed.initial.player.handRefillSize + modifier;
  }
}