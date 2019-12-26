import { Game } from "../../../game/entities/game";
import { TurnResult } from "./turn-result";
import { TurnAction } from "../turn-action/turn-action";
import { TurnActionResult } from "../turn-action/turn-action-result";

export class PlayerTurn {
  static execute(game: Game, turnActions: TurnAction[]):TurnResult {
    const turnResult = new TurnResult(game);
    let result = new TurnActionResult(turnResult.game);
    for (const turnAction of turnActions) {
      result = turnAction.execute(result.game);
      turnResult.recordTurnActionResult(result);
    }
    result = PlayerTurn.refresh(turnResult.game);
    turnResult.recordTurnActionResult(result);
    return turnResult;
  }

  static refresh(game: Game):TurnActionResult {
    const result = new TurnActionResult(game);
    result.game.player.refresh();
    for (const field of result.game.player.field) {
      if (field.card) {
        result.recordCardChange(field.card);
      }
    }
    return result;
  }
}