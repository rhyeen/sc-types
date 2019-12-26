export class CardConditions {
  exhausted?: boolean;
  _shield?: number;
  _damage?: number;

  get shield():number {
    if (this._shield && this._shield > 0) {
      return this._shield;
    }
    return 0;
  }

  set shield(shield: number) {
    this._shield = shield;
  }

  get damage():number {
    if (this._damage && this._damage > 0) {
      return this._damage;
    }
    return 0;
  }

  set damage(damage: number) {
    this._damage = damage;
  }

  refresh() {
    this.exhausted = false;
  }

  copy():CardConditions {
    const cardConditions = new CardConditions();
    cardConditions.shield = this.shield;
    cardConditions.exhausted = this.exhausted;
    cardConditions.damage = this.damage;
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
    if (this.damage) {
      conditions['damage'] = this.damage;
    }
    if (!Object.keys(conditions).length) {
      return null;
    }
    return conditions;
  }
}