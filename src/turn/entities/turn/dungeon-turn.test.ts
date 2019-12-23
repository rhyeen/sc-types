import { typicalStartingGame } from "../../../game/test-utils/test-defaults";
import { DungeonTurn } from "./dungeon-turn";
import { GameChange } from "../../enums/game-change";
import { MinionCard } from "../../../card/entities/card/minion-card";
import { PlaceMinionAction } from "../turn-action/player-turn-actions/place-minion-action";

test('player field empty.  All three attacks should be against player', () => {
  const game = typicalStartingGame();
  const result = DungeonTurn.execute(game);
  expect(result.game.player.health.current).toBe(14);
  expect(result.game.dungeon.field[0].card instanceof MinionCard).toBeTruthy();
  expect(result.game.dungeon.field[1].card instanceof MinionCard).toBeTruthy();
  expect(result.game.dungeon.field[2].card instanceof MinionCard).toBeTruthy();
  if (!(result.game.dungeon.field[0].card instanceof MinionCard) || 
      !(result.game.dungeon.field[1].card instanceof MinionCard) ||
      !(result.game.dungeon.field[2].card instanceof MinionCard)) {
    return;
  }
  expect(result.game.dungeon.field[0].card.isExhausted()).toBeTruthy();
  expect(result.game.dungeon.field[1].card.isExhausted()).toBeTruthy();
  expect(result.game.dungeon.field[2].card.isExhausted()).toBeTruthy();
  expect(result.gameChanges.size).toBe(1);
  expect(result.gameChanges.has(GameChange.PlayerHealth)).toBeTruthy();
  expect(result.cardChanges.size).toBe(3);
  expect(result.cardChanges.has(result.game.dungeon.field[0].card)).toBeTruthy();
  expect(result.cardChanges.has(result.game.dungeon.field[1].card)).toBeTruthy();
  expect(result.cardChanges.has(result.game.dungeon.field[2].card)).toBeTruthy();
});

test('player field has one minion.  Attack should be against a minion, the rest against the player', () => {
  const game = typicalStartingGame();
  let actionResult = new PlaceMinionAction(0, 0).execute(game);
  const result = DungeonTurn.execute(actionResult.game);
  expect(result.game.player.health.current).toBe(16);
  expect(result.game.dungeon.field[0].card instanceof MinionCard).toBeTruthy();
  expect(result.game.dungeon.field[1].card instanceof MinionCard).toBeTruthy();
  expect(result.game.dungeon.field[2].card instanceof MinionCard).toBeTruthy();
  if (!(result.game.dungeon.field[0].card instanceof MinionCard) || 
      !(result.game.dungeon.field[1].card instanceof MinionCard) ||
      !(result.game.dungeon.field[2].card instanceof MinionCard)) {
    return;
  }
  expect(result.game.dungeon.field[0].card.isExhausted()).toBeTruthy();
  expect(result.game.dungeon.field[1].card.isExhausted()).toBeTruthy();
  expect(result.game.dungeon.field[2].card.isExhausted()).toBeTruthy();
  expect(result.gameChanges.size).toBe(3);
  expect(result.gameChanges.has(GameChange.PlayerHealth)).toBeTruthy();
  expect(result.gameChanges.has(GameChange.PlayerField)).toBeTruthy();
  expect(result.gameChanges.has(GameChange.PlayerDiscardDeck)).toBeTruthy();
  expect(result.cardChanges.size).toBe(4);
  expect(result.cardChanges.has(result.game.dungeon.field[0].card)).toBeTruthy();
  expect(result.cardChanges.has(result.game.dungeon.field[1].card)).toBeTruthy();
  expect(result.cardChanges.has(result.game.dungeon.field[2].card)).toBeTruthy();
  expect(result.cardChanges.has(result.game.player.discardDeck.cards[0])).toBeTruthy();
});


test('player field has one minion, but dungeon minions have range 2.  All attacks against the player', () => {
  const game = typicalStartingGame();
  let actionResult = new PlaceMinionAction(0, 0).execute(game);
  expect(actionResult.game.dungeon.field[0].card instanceof MinionCard).toBeTruthy();
  if (!(actionResult.game.dungeon.field[0].card instanceof MinionCard)) {
    return;
  }
  actionResult.game.dungeon.field[0].card.range = 2;
  const result = DungeonTurn.execute(actionResult.game);
  expect(result.game.player.health.current).toBe(14);
  expect(result.gameChanges.size).toBe(1);
  expect(result.gameChanges.has(GameChange.PlayerHealth)).toBeTruthy();
  expect(result.cardChanges.size).toBe(3);
  // @DEBUG: the problem is that the game is being copied for each turn action.  We should probably only do a copy once, up front,
  // so that these can be stored properly.
  // @TODO: make a similar check in player-turn
  expect(result.cardChanges.has(result.game.dungeon.field[0].card)).toBeTruthy();
  expect(result.cardChanges.has(result.game.dungeon.field[1].card)).toBeTruthy();
  expect(result.cardChanges.has(result.game.dungeon.field[2].card)).toBeTruthy();
});