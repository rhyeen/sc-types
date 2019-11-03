import { ActionType } from "../../enums/action-type";
import { ActionTarget } from "../action-target";
import { Game } from "../../../game/entities/game";
import { TurnActionResult } from "./turn-action-result";

export class TurnAction {
  type: ActionType;

  constructor(actionType: ActionType) {
    this.type = actionType;
  }

  json():any {
    return {
      type: this.type
    };
  }

  execute(game: Game):TurnActionResult {
    throw new Error(`cannot execute on a generic action type`);
  }

  validate(game: Game) {
    throw new Error(`cannot validate on a generic action type`);
  }
}

export class ActionWithTargets extends TurnAction {
  targets: ActionTarget[];
  
  constructor(actionType: ActionType, targets: ActionTarget[]) {
    super(actionType);
    this.targets = targets;
  }

  protected targetsJson():any {
    const targets = [];
    for (let target of this.targets) {
      targets.push(target.json());
    }
    return targets;
  }
}

export class PlayMinionAttackAction extends ActionWithTargets {
  playerSourceFieldIndex: number;

  constructor(playerSourceFieldIndex: number, targets: ActionTarget[]) {
    super(ActionType.PlayMinionAttack, targets);
    this.playerSourceFieldIndex = playerSourceFieldIndex;
  }

  json():any {
    return {
      type: this.type,
      source: {
        fieldIndex: this.playerSourceFieldIndex
      },
      targets: this.targetsJson()
    };
  }
}

export class PlayMinionAbilityAction extends ActionWithTargets {
  playerSourceFieldIndex: number;
  targets: ActionTarget[];

  constructor(playerSourceFieldIndex: number, targets: ActionTarget[]) {
    super(ActionType.PlayMinionAbility, targets);
    this.playerSourceFieldIndex = playerSourceFieldIndex;
  }

  json():any {
    return {
      type: this.type,
      source: {
        fieldIndex: this.playerSourceFieldIndex
      },
      targets: this.targetsJson()
    };
  }
}

export class PlaySpellAbilityAction extends ActionWithTargets {
  playerSourceHandIndex: number;
  targets: ActionTarget[];

  constructor(playerSourceHandIndex: number, targets: ActionTarget[]) {
    super(ActionType.PlaySpellAbility, targets);
    this.playerSourceHandIndex = playerSourceHandIndex;
  }

  json():any {
    return {
      type: this.type,
      source: {
        handIndex: this.playerSourceHandIndex
      },
      targets: this.targetsJson()
    };
  }
}