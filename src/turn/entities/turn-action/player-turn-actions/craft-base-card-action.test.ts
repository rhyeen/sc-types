import { gameOnCraftingTurn } from "../../../../game/test-utils/test-defaults";
import { CraftBaseCardAction } from "./craft-base-card-action";
import { GameChange } from "../../../enums/game-change";
import { CardType } from "../../../../card/enums/card-type";
import { SpellDraftCard } from "../../../../card/entities/draft-card/spell-draft-card";
import { DraftCard } from "../../../../card/entities/draft-card/draft-card";
import { MinionDraftCard } from "../../../../card/entities/draft-card/minion-draft-card";

function _testDraftCardType(draftCard:DraftCard):void {
  switch(draftCard.type) {
    case CardType.Spell:
      expect(draftCard instanceof SpellDraftCard);
      return;
    case CardType.Minion:
      expect(draftCard instanceof MinionDraftCard);
      return;
    default:
      throw new Error(`unexpected draft card type: ${draftCard.type}`);
  }
}

test('@REGRESSION: ensure draft card type is of extended class after action', () => {
  const game = gameOnCraftingTurn();
  _testDraftCardType(game.player.craftingTable.baseCards[0]);
  const action = new CraftBaseCardAction(0, 0);
  const result = action.execute(game);
  expect(result.game.player.craftingTable.baseCards.length).toEqual(0);
  expect(result.game.player.craftingTable.forge[0].card.type).toEqual(game.player.craftingTable.baseCards[0].type);
  _testDraftCardType(result.game.player.craftingTable.forge[0].card);
  expect(result.gameChanges.has(GameChange.PlayerBaseCards));
  expect(result.gameChanges.has(GameChange.PlayerForge));
});