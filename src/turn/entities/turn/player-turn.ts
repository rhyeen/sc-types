import { Game } from "../../../game/entities/game";
import { TurnResult } from "./turn-result";
import { TurnAction } from "../turn-action/turn-action";
import { TurnActionResult } from "../turn-action/turn-action-result";

export class PlayerTurn {
  static execute(game: Game, turnActions: TurnAction[]):TurnResult {
    const turnResult = new TurnResult();
    let result = new TurnActionResult(game);
    for (const turnAction of turnActions) {
      result = turnAction.execute(result.game);
      turnResult.recordTurnActionResult(result);
    }
    return turnResult;
  }
}