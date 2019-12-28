import { CardSetBuilder } from "../../../card/services/builders/card-set-builder";
import { PlayerBuilder } from "./player-builder";
import { DungeonBuilder } from "./dungeon-builder";
import { Game } from "../../entities/game";

export class GameBuilder {
  static buildGame(gameData: any):Game {
    const cardSets = CardSetBuilder.buildCardSets(gameData.cardSets);
    const player = PlayerBuilder.buildPlayer(gameData.player, cardSets);
    const dungeon = DungeonBuilder.buildDungeon(gameData.dungeon, cardSets);
    return new Game(gameData.id, player, dungeon, cardSets, gameData.phase);
  }
}