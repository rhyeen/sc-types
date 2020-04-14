import { StaticCardAbilityId, VariableCardAbilityId, CardAbilityTier } from "../enums/card-ability";

export interface CardAbilityInterface {
  id: string;
  amount?: number;
  tier?: CardAbilityTier;
}

export class CardAbility implements CardAbilityInterface {
  id: string;
  tier?: CardAbilityTier;
  private _used: boolean;

  constructor(id: string, tier?: CardAbilityTier) {
    this.id = id;
    this.tier = tier;
    this._used = false;
  }

  use() {
    this._used = true;
  }

  get used():boolean {
    return this._used;
  }

  copy():CardAbility {
    return new CardAbility(this.id, this.tier);
  }

  // @TODO: this should be put on a trigger as well later
  incrementTurn() {
    this._used = false;
    return;
  }

  static targetsDungeonMinion():boolean {
    return false;
  }

  static targetsDungeon():boolean {
    return false;
  }

  static targetsPlayerMinion():boolean {
    return false;
  }

  static targetsPlayer():boolean {
    return false;
  }

  json():any {
    const ability = {
      id: this.id
    };
    if (this.tier) {
      ability['tier'] = this.tier;
    }
    return ability;
  }
}

export class StaticCardAbility extends CardAbility {
  id: StaticCardAbilityId;

  constructor(id: StaticCardAbilityId, tier?: CardAbilityTier) {
    super(id, tier);
  }

  copy():StaticCardAbility {
    return new StaticCardAbility(this.id, this.tier);
  }
}

export class VariableCardAbility extends CardAbility {
  id: VariableCardAbilityId;
  amount: number;

  constructor(id: VariableCardAbilityId, amount: number, tier?: CardAbilityTier) {
    super(id, tier)
    this.amount = amount;
  }

  copy():VariableCardAbility {
    return new VariableCardAbility(this.id, this.amount, this.tier);
  }

  json():any {
    const ability = {
      id: this.id,
      amount: this.amount
    };
    if (this.tier) {
      ability['tier'] = this.tier;
    }
    return ability;
  }
}

export class CardAbilityHaste extends StaticCardAbility {
  constructor() {
    super(StaticCardAbilityId.Haste, CardAbilityTier.Minion1);
  }
}

export class CardAbilityEnergize extends VariableCardAbility {
  constructor(amount: number) {
    super(VariableCardAbilityId.Energize, amount, CardAbilityTier.Godly);
  }

  static targetsPlayer():boolean {
    return true;
  }
}

export class CardAbilitySpellshot extends VariableCardAbility {
  constructor(amount: number) {
    super(VariableCardAbilityId.Spellshot, amount, CardAbilityTier.Spell1);
  }

  static targetsDungeonMinion():boolean {
    return true;
  }
}

export class CardAbilityReach extends VariableCardAbility {
  constructor(amount: number) {
    super(VariableCardAbilityId.Reach, amount, CardAbilityTier.Spell1);
  }

  static targetsPlayerMinion():boolean {
    return true;
  }
}

export class CardAbilityDirectHit extends VariableCardAbility {
  constructor(amount: number) {
    super(VariableCardAbilityId.DirectHit, amount, CardAbilityTier.Minion1);
  }

  static targetsDungeon():boolean {
    return true;
  }
}
