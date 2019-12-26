import { CraftingPartStatType } from "../enums/crafting-part";
import { CardAbility } from "./card-ability";
import { CardAbilityTier } from "../enums/card-ability";

export class CraftingPart {
}

export class AbilityCraftingPart extends CraftingPart {
  ability: CardAbility;

  constructor(ability: CardAbility) {
    super();
    this.ability = ability;
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
}

export class AttackStatCraftingPart extends StatCraftingPart {
  constructor(amount: number) {
    super(CraftingPartStatType.Attack, amount);
  }
}

export class HealthStatCraftingPart extends StatCraftingPart {
  constructor(amount: number) {
    super(CraftingPartStatType.Health, amount);
  }
}

export class RangeStatCraftingPart extends StatCraftingPart {
  constructor(amount: number) {
    super(CraftingPartStatType.Range, amount);
  }
}
