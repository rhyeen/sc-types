import { defaultGame } from "../../../game/test-utils/test-defaults";
import { PlayerTurn } from "./player-turn";
import { PlaceMinionAction } from "../turn-action/player-turn-actions/place-minion-action";
import { PlayMinionAttackAction } from "../turn-action/player-turn-actions/play-minion-attack-action";
import { OpponentMinionActionTarget } from "../action-target";
import { GameChange } from "../../enums/game-change";
import { CardAbilityHaste } from "../../../card/entities/card-ability";
import { MinionCard } from "../../../card/entities/card/minion-card";

test('place minion, attack with minion, and player minion dies', () => {
  const game = defaultGame();
  game.player.hand.cards[0].abilities.push(new CardAbilityHaste());
  const turnActions = [
    new PlaceMinionAction(0, 0),
    // @NOTE: this killed the player minion
    new PlayMinionAttackAction(0, [new OpponentMinionActionTarget(0)])
  ];
  const result = PlayerTurn.execute(game, turnActions);
  expect(result.game.player.energy.current).toBe(7);
  expect(result.game.player.field[0].card).toEqual(null);
  expect(result.game.player.discardDeck.cards.length).toEqual(1);
  expect(result.game.player.hand.size()).toBe(game.player.hand.size() - 1);
  expect(result.game.dungeon.field[0].card instanceof MinionCard).toBeTruthy();
  expect(game.dungeon.field[0].card instanceof MinionCard).toBeTruthy();
  if (!(result.game.dungeon.field[0].card instanceof MinionCard) || !(game.dungeon.field[0].card instanceof MinionCard)) {
    return;
  }
  expect(result.game.dungeon.field[0].card.remainingHealth).toBe(game.dungeon.field[0].card.remainingHealth - 1);
  expect(result.gameChanges.has(GameChange.PlayerField)).toBeTruthy();
  expect(result.gameChanges.has(GameChange.PlayerHand)).toBeTruthy();
  expect(result.gameChanges.has(GameChange.PlayerEnergy)).toBeTruthy();
  expect(result.gameChanges.has(GameChange.PlayerDiscardDeck)).toBeTruthy();
  expect(result.cardChanges.has(game.player.hand.cards[0])).toBeFalsy();
});
