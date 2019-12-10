import { Game } from "./game";
import { defaultCardSets, defaultPlayer, defaultDungeon, defaultGame } from "../test-utils/test-defaults";

test('init', () => {
  const cardSets = defaultCardSets();
  const game = new Game('GM_1', defaultPlayer(cardSets), defaultDungeon(cardSets), cardSets);
  expect(game.cardSets).toBe(cardSets);
  expect(game.dungeon.field[0].backlog[1]).toBe(cardSets['HS_1'].instances['CD_1_2']);
});

test('ensure copy creates a new instance with different references', () => {
  const game = defaultGame();
  const gameCopy = game.copy();
  gameCopy.dungeon.field[0].card.name = 'new name';
  expect(gameCopy.dungeon.field[0].card.name).not.toEqual(game.dungeon.field[0].card.name);
});

test('json with reduce and hidePrivate set to true', () => {
  const game = defaultGame();
  const result = game.json(true, true);
  expect(result.id).toEqual('GM_1');
  expect(result.player.health.current).toEqual(20);
  expect(result.player.health.max).toEqual(20);
});