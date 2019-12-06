export class CardConditions {
  exhausted?: boolean;
  _shield?: number;

  get shield():number {
    if (this._shield && this._shield > 0) {
      return this._shield;
    }
    return 0;
  }

  set shield(shield: number) {
    this._shield = shield;
  }

  copy():CardConditions {
    const cardConditions = new CardConditions();
    cardConditions.shield = this.shield;
    cardConditions.exhausted = this.exhausted;
    return cardConditions;
  }

  json():any {
    const conditions = {};
    if (this.exhausted) {
      conditions['exhausted'] = this.exhausted;
    }
    if (this.shield) {
      conditions['shield'] = this.shield;
    }
    if (!Object.keys(conditions).length) {
      return null;
    }
    return conditions;
  }
}