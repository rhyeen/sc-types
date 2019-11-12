import { CraftingPartStatType } from "../enums/crafting-part";
import { CardAbility } from "./card-ability";
import { CardAbilityTier } from "../enums/card-ability";

export class CraftingPart {
}

export class StatCraftingPart extends CraftingPart {
  stat: CraftingPartStat;
  
  constructor(stat: CraftingPartStat) {
    super();
    this.stat = stat;
  }
}

export class AbilityCraftingPart extends CraftingPart {
  ability: CardAbility;
  tier: CardAbilityTier;

  constructor(ability: CardAbility, tier: CardAbilityTier) {
    super();
    this.ability = ability;
    this.tier = tier;
  }
}

export interface CraftingPartStat {
  type: CraftingPartStatType;
  amount: number;
}

export class CraftingPartAttackStat implements CraftingPartStat {
  type: CraftingPartStatType;
  amount: number;

  constructor(amount: number) {
    this.type = CraftingPartStatType.Attack;
    this.amount = amount;
  }
}

export class CraftingPartHealthStat implements CraftingPartStat {
  type: CraftingPartStatType;
  amount: number;

  constructor(amount: number) {
    this.type = CraftingPartStatType.Health;
    this.amount = amount;
  }
}

export class CraftingPartRangeStat implements CraftingPartStat {
  type: CraftingPartStatType;
  amount: number;

  constructor(amount: number) {
    this.type = CraftingPartStatType.Range;
    this.amount = amount;
  }
}
