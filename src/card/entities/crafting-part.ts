import { CraftingPartStatType } from "../enums/crafting-part";
import { CardAbility } from "./card-ability";
import { CardAbilityTier } from "../enums/card-ability";

export class CraftingPart {
  json():any {
    throw new Error(`root CraftingPart object cannot be jsonified`);
  }

  copy():CraftingPart {
    throw new Error(`root CraftingPart object cannot be copied`);
  }
}

export class AbilityCraftingPart extends CraftingPart {
  ability: CardAbility;

  constructor(ability: CardAbility) {
    super();
    this.ability = ability;
  }

  get tier():CardAbilityTier {
    return this.ability.tier;
  }

  json():any {
    return {
      ability: this.ability.json(),
      tier: this.tier
    };
  }

  copy():CraftingPart {
    return new AbilityCraftingPart(this.ability);
  }
}

export class StatCraftingPart extends CraftingPart {
  type: CraftingPartStatType;
  amount: number;
  
  constructor(type: CraftingPartStatType, amount: number) {
    super();
    this.type = type;
    this.amount = amount;
  }

  json():any {
    return {
      type: this.type,
      amount: this.amount
    };
  }

  copy():CraftingPart {
    return new StatCraftingPart(this.type, this.amount);
  }
}

export class AttackStatCraftingPart extends StatCraftingPart {
  constructor(amount: number) {
    super(CraftingPartStatType.Attack, amount);
  }

  copy():AttackStatCraftingPart {
    return new AttackStatCraftingPart(this.amount);
  }
}

export class HealthStatCraftingPart extends StatCraftingPart {
  constructor(amount: number) {
    super(CraftingPartStatType.Health, amount);
  }

  copy():HealthStatCraftingPart {
    return new HealthStatCraftingPart(this.amount);
  }
}

export class RangeStatCraftingPart extends StatCraftingPart {
  constructor(amount: number) {
    super(CraftingPartStatType.Range, amount);
  }

  copy():RangeStatCraftingPart {
    return new RangeStatCraftingPart(this.amount);
  }
}
