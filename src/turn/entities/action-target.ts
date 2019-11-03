import { ActionTargetType } from "../enums/action-type";

export class ActionTarget {
  type: ActionTargetType;

  constructor(actionTargetType: ActionTargetType) {
    this.type = actionTargetType;
  }

  json() {
    return {
      type: this.type
    };
  }
}

export class OpponentMinionActionTarget extends ActionTarget {
  targetOpponentFieldIndex: number;

  constructor(targetOpponentFieldIndex: number) {
    super(ActionTargetType.TargetOpponentMinion);
    this.targetOpponentFieldIndex = targetOpponentFieldIndex;
  }

  json() {
    return {
      type: this.type,
      fieldIndex: this.targetOpponentFieldIndex
    };
  }
}

export class PlayerMinionActionTarget extends ActionTarget {
  targetPlayerFieldIndex: number;

  constructor(targetPlayerFieldIndex: number) {
    super(ActionTargetType.TargetPlayerMinion);
    this.targetPlayerFieldIndex = targetPlayerFieldIndex;
  }

  json() {
    return {
      type: this.type,
      fieldIndex: this.targetPlayerFieldIndex
    };
  }
}

export class PlayerActionTarget extends ActionTarget {
  constructor() {
    super(ActionTargetType.TargetPlayer);
  }
}

export class OpponentActionTarget extends ActionTarget {
  constructor() {
    super(ActionTargetType.TargetOponnet);
  }
}