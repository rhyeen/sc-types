import { Game } from '../entities/game';
import { Player } from '../entities/player/player';
import { Dungeon } from '../entities/dungeon';
import { DungeonFieldSlot } from '../entities/field-slot';
import { Relic } from '../../items/entities/relic';
import { CardSet } from '../../card/entities/card-set';
import { Card } from '../../card/entities/card/card';
import { CardBuilder } from '../../card/services/card-builder';
import { CardFinder } from '../../card/services/card-finder';

export class GameGenerator {
  public static generateFromSeed(gameId: string, dungeonSeed: any, playerContext: any):Game {
    const cardSets = { ...GameGenerator.getPlayerStartingCards(playerContext), ...GameGenerator.getPossibleDungeonCards(dungeonSeed) };
    const player = GameGenerator.getPlayer(dungeonSeed, playerContext, cardSets);    
    const dungeonField = [
      GameGenerator.getDungeonFieldSlot(dungeonSeed, cardSets),
      GameGenerator.getDungeonFieldSlot(dungeonSeed, cardSets),
      GameGenerator.getDungeonFieldSlot(dungeonSeed, cardSets),
    ];
    const dungeon = new Dungeon(dungeonField);
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
      cardSets[card.hash] = new CardSet(card, [card]);
    }
  }

  private static getPossibleDungeonCards(dungeonSeed: any):Record<string, CardSet> {
    const cardSets = {};
    for (const baseCard of dungeonSeed.dungeonCards) {
      GameGenerator.addCardToSets(cardSets, CardBuilder.buildCard(baseCard));
    }
    return cardSets;
  }

  private static getPlayer(dungeonSeed: any, playerContext: any, cardSets: Record<string, CardSet>):Player {
    const playerOwnedRelics = GameGenerator.extractRelics(playerContext);
    const maxHealth = GameGenerator.getPlayerMaxHealth(dungeonSeed, playerOwnedRelics);
    const maxEnergy = GameGenerator.getPlayerMaxEnergy(dungeonSeed, playerOwnedRelics);
    const handRefillSize = GameGenerator.getPlayerMaxHandRefillSize(dungeonSeed, playerOwnedRelics);
    const player = new Player(maxHealth, maxEnergy, handRefillSize);
    // @NOTE: All starting hand cards are put into draw deck and other cards into discard deck because when
    // the game begins, a hand will be drawn from the draw deck first, then the discard deck will be shuffled
    // into the draw deck and drawn from.
    // @TODO: add all player cards to discardDeck.
    //player.discardDeck.add();
    // @TODO: remove all starting hand cards from discard deck and add to draw deck.
    // player.drawDeck.add(CardFinder.getEnergizeCard(cardSets));
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

  private static getDungeonFieldSlot(dungeonSeed: any, cardSets: Record<string, CardSet>):DungeonFieldSlot {

  }
}