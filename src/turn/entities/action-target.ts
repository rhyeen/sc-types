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

export class DungeonMinionActionTarget extends ActionTarget {
  targetDungeonFieldIndex: number;

  constructor(targetDungeonFieldIndex: number) {
    super(ActionTargetType.TargetDungeonMinion);
    this.targetDungeonFieldIndex = targetDungeonFieldIndex;
  }

  json() {
    return {
      type: this.type,
      fieldIndex: this.targetDungeonFieldIndex
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

export class DungeonActionTarget extends ActionTarget {
  constructor() {
    super(ActionTargetType.TargetOponnet);
  }
}