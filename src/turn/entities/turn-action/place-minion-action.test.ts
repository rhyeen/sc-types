import { defaultGame } from "../../../game/test-utils/test-defaults";
import { PlaceMinionAction } from "./place-minion-action";
import { GameChange } from "../../enums/game-change";

test('execute once on an empty field, checking the copy was modified but not the original', () => {
  const game = defaultGame();
  const placeMinionAction = new PlaceMinionAction(0, 0);
  const result = placeMinionAction.execute(game);
  // ensure copy was done correctly
  result.game.player.field[0].card.name = 'new name';
  expect(result.game.player.field[0].card.name).not.toEqual(game.player.hand.cards[0].name);
  expect(result.game.player.field[0].card.id).toEqual(game.player.hand.cards[0].id);
  expect(result.game.player.hand.size()).not.toEqual(game.player.hand.size());
  expect(result.game.player.hand.cards[0].id).not.toEqual(game.player.hand.cards[0].id);
  expect(result.gameChanges.has(GameChange.PlayerField)).toBeTruthy();
  expect(result.gameChanges.has(GameChange.PlayerHand)).toBeTruthy();
  expect(result.gameChanges.has(GameChange.PlayerEnergy)).toBeTruthy();
  expect(result.gameChanges.has(GameChange.PlayerDiscardDeck)).toBeFalsy();
  expect(result.cardChanges.has(game.player.hand.cards[0])).toBeFalsy();
  expect(result.cardChanges.has(result.game.player.field[0].card)).toBeTruthy();
  expect(result.game.player.energy.current).not.toEqual(game.player.energy.current);
});

test('execute on a field that already has a card', () => {
  const game = defaultGame();
  let placeMinionAction = new PlaceMinionAction(0, 0);
  let result = placeMinionAction.execute(game);
  placeMinionAction = new PlaceMinionAction(0, 0);
  result = placeMinionAction.execute(result.game);
  expect(result.game.player.hand.size()).toEqual(1);
  expect(result.gameChanges.has(GameChange.PlayerField)).toBeTruthy();
  expect(result.gameChanges.has(GameChange.PlayerHand)).toBeTruthy();
  expect(result.gameChanges.has(GameChange.PlayerEnergy)).toBeTruthy();
  expect(result.gameChanges.has(GameChange.PlayerDiscardDeck)).toBeTruthy();
  expect(result.game.player.field[0].card.id).toEqual('CD_2_1');
  expect(result.game.player.discardDeck.cards[0].id).toEqual('CD_2_0');
  expect(result.cardChanges.has(result.game.player.field[0].card)).toBeTruthy();
  expect(result.cardChanges.has(result.game.player.discardDeck.cards[0])).toBeTruthy();
  expect(result.game.player.energy.current).toEqual(4);
});
