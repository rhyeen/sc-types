import { defaultGame } from "../../../game/test-utils/test-defaults";
import { PlayerTurn } from "./player-turn";
import { PlaceMinionAction } from "../turn-action/player-turn-actions/place-minion-action";
import { PlayMinionAttackAction } from "../turn-action/player-turn-actions/play-minion-attack-action";
import { DungeonMinionActionTarget } from "../action-target";
import { GameChange } from "../../enums/game-change";
import { CardAbilityHaste } from "../../../card/entities/card-ability";
import { MinionCard } from "../../../card/entities/card/minion-card";
import { CraftingPart } from "../../../card/entities/crafting-part";
import { DraftCard } from "../../../card/entities/draft-card/draft-card";

test('place minion, attack with minion, and player minion dies', () => {
  const game = defaultGame();
  game.player.hand.cards[0].abilities.push(new CardAbilityHaste());
  const turnActions = [
    new PlaceMinionAction(0, 0),
    new PlayMinionAttackAction(0, [new DungeonMinionActionTarget(0)])
  ];
  const result = PlayerTurn.execute(game, turnActions);
  expect(result.game.player.energy.current).toBe(7);
  expect(!result.game.player.field[0].card).toBeTruthy();
  expect(result.game.player.discardDeck.cards.length).toEqual(1);
  expect(result.game.player.discardDeck.cards[0].conditions.damage).toEqual(0);
  expect(result.game.player.discardDeck.cards[0].conditions.exhausted).toBeFalsy();
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
  // validate craftingTable changes
  expect(result.craftingParts.length).toBe(3);
  expect(result.baseDraftCards.length).toBe(1);
  expect(result.craftingParts[0] instanceof CraftingPart).toBeTruthy();
  expect(result.baseDraftCards[0] instanceof DraftCard).toBeTruthy();
  expect(result.game.player.craftingTable.craftingParts.length).toBe(3);
  expect(result.game.player.craftingTable.baseCards.length).toBe(1);
  expect(result.craftingParts[0]).toBe(result.game.player.craftingTable.craftingParts[0]);
  expect(result.baseDraftCards[0]).toBe(result.game.player.craftingTable.baseCards[0]);

});
