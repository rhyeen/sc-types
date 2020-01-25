import { Game } from "../../../game/entities/game";
import { TurnResult } from "./turn-result";
import { TurnAction } from "../turn-action/turn-action";
import { TurnActionResult } from "../turn-action/turn-action-result";
import { DraftGenerationResult } from "../turn-action/draft-generation-result";
import { GamePhase } from "../../../game/enums/game-phase";
import { BaseDraftCardGenerator } from "../../../craft/services/generators/base-draft-card-generator";
import { getDefaultCraftingPartRandomConditions, getDefaultBaseDraftCardRandomConditions } from "../../../craft/services/generators/default-random-conditions";
import { CraftingPartGenerator } from "../../../craft/services/generators/crafting-part-generator";
import { GameChange } from "../../enums/game-change";

export class PlayerTurn {
  static execute(game: Game, turnActions: TurnAction[]):TurnResult {
    switch (game.phase) {
      case GamePhase.Battle:
        return PlayerTurn.executeBattlePhase(game, turnActions);
      case GamePhase.Draft:
        return PlayerTurn.executeDraftPhase(game, turnActions);
      default:
        throw new Error(`unexpected game phase: ${game.phase}`);
    }
  }

  static executeBattlePhase(game: Game, turnActions: TurnAction[]):TurnResult {
    const turnResult = new TurnResult(game);
    let result = new TurnActionResult(turnResult.game);
    for (const turnAction of turnActions) {
      result = turnAction.execute(result.game);
      turnResult.recordTurnActionResult(result);
    }
    result = PlayerTurn.refresh(turnResult.game);
    turnResult.recordTurnActionResult(result);
    result = PlayerTurn.switchPhase(turnResult.game);
    turnResult.recordTurnActionResult(result);
    const draftGenerationResult = PlayerTurn.generateCraftingTableComponents(turnResult.game);
    turnResult.recordDraftGenerationResult(draftGenerationResult);
    return turnResult;
  }

  private static refresh(game: Game):TurnActionResult {
    const result = new TurnActionResult(game);
    result.game.player.refresh();
    for (const field of result.game.player.field) {
      if (field.card) {
        result.recordCardChange(field.card);
      }
    }
    return result;
  }

  private static switchPhase(game: Game):TurnActionResult {
    const result = new TurnActionResult(game);
    result.game.shiftPhase();
    result.recordGameChange(GameChange.GamePhase);
    return result;
  }

  private static generateCraftingTableComponents(game: Game):DraftGenerationResult {
    const result = new DraftGenerationResult(game);
    const baseDraftCardGenerator = new BaseDraftCardGenerator(getDefaultBaseDraftCardRandomConditions());
    const baseDraftCards = baseDraftCardGenerator.generateBaseDraftCards(game);
    result.game.player.craftingTable.baseCards = baseDraftCards;
    result.recordGeneratedBaseDraftCards(baseDraftCards);
    const craftingPartGenerator = new CraftingPartGenerator(getDefaultCraftingPartRandomConditions());
    const craftingParts = craftingPartGenerator.generateCraftingParts(game);
    result.game.player.craftingTable.craftingParts = craftingParts;
    result.recordGeneratedCraftingParts(craftingParts);
    return result;
  }

  private static executeDraftPhase(game: Game, turnActions: TurnAction[]):TurnResult {
    const turnResult = new TurnResult(game);
    let result = new TurnActionResult(turnResult.game);
    result = PlayerTurn.switchPhase(turnResult.game);
    turnResult.recordTurnActionResult(result);
    throw new Error(`not implemented yet`);
    return turnResult;
  }
}