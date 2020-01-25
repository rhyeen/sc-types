import { gameOnCraftingTurn } from "../../../../game/test-utils/test-defaults";
import { AddCraftedCardToDeckAction } from './add-crafted-card-to-deck-action';
import { CardOrigin } from "../../../../card/entities/card-origin/card-origin";

test('basic test', () => {
  const game = gameOnCraftingTurn();
  game.player.craftingTable.forge[0].card = game.player.craftingTable.baseCards[0];
  game.player.craftingTable.baseCards = [];
  const cardOrigin = new CardOrigin();
  cardOrigin.name = 'imp';
  const action = new AddCraftedCardToDeckAction(0, 1, cardOrigin);
  const result = action.execute(game);
  expect(game.player.craftingTable.forge[0].card).toBeTruthy();
  expect(result.game.player.craftingTable.forge[0].card).toBeFalsy();
  const card = game.player.craftingTable.forge[0].card.buildCard();
  expect(result.game.cardSets[card.hash]).toBeTruthy();
  expect(result.game.cardSets[card.hash].getInstances()[0].name).toBe(cardOrigin.name);
  const discardCards = result.game.player.discardDeck.cards;
  expect(discardCards[discardCards.length - 1].id).toBe(result.game.cardSets[card.hash].getInstances()[0].id);
});