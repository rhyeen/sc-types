import { Game } from '../../entities/game';
import { CardSet } from '../../../card/entities/card-set';
import { Card } from '../../../card/entities/card/card';
import { CardBuilder } from '../../../card/services/card-builder';
import { DungeonGenerator } from './dungeon-generator';
import { PlayerGenerator } from './player-generator';

export class GameGenerator {
  public static generateFromSeed(gameId: string, dungeonSeed: any, playerContext: any):Game {
    const cardSets = { ...GameGenerator.getPlayerStartingCards(playerContext), ...GameGenerator.getPossibleDungeonCards(dungeonSeed) };
    const player = PlayerGenerator.generatePlayer(dungeonSeed, playerContext, cardSets);    
    const dungeon = DungeonGenerator.generateDungeon(dungeonSeed, cardSets);
    return new Game(gameId, player, dungeon, cardSets);
  }

  private static getPlayerStartingCards(playerContext: any):Record<string, CardSet> {
    const cardSets = {};
    for (const baseCard of playerContext.baseCards) {
      GameGenerator.addCardToSets(cardSets, CardBuilder.buildCard(baseCard));
    }
    return cardSets;
  }

  // @MUTATES: cardSets
  private static addCardToSets(cardSets: Record<string, CardSet>, card: Card):void {
    if (card.hash in cardSets) {
      cardSets[card.hash].setInstance(card);
    } else {
      const instances = [];
      if (card.id) {
        instances.push(card);
      }
      cardSets[card.hash] = new CardSet(card, instances);
    }
  }

  private static getPossibleDungeonCards(dungeonSeed: any):Record<string, CardSet> {
    const cardSets = {};
    for (const baseCard of dungeonSeed.dungeonCards) {
      GameGenerator.addCardToSets(cardSets, CardBuilder.buildCard(baseCard));
    }
    return cardSets;
  }
}