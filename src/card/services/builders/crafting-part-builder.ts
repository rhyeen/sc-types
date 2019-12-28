import { StatCraftingPart, AttackStatCraftingPart, HealthStatCraftingPart, RangeStatCraftingPart, CraftingPart, AbilityCraftingPart } from "../../entities/crafting-part";
import { CraftingPartStatType } from "../../enums/crafting-part";
import { CardBuilder } from "./card-builder";

export interface StatPartData {
  type: CraftingPartStatType;
  amount: number;
}

export class CraftingPartBuilder {
  static buildCraftingPart(craftingPartData: any):CraftingPart {
    if (craftingPartData.type) {
      return CraftingPartBuilder.buildStatCraftingPart(craftingPartData);
    } else {
      return CraftingPartBuilder.buildAbilityCraftingPart(craftingPartData);
    }
  }

  static buildStatCraftingPart(statCraftingPartsData: StatPartData):StatCraftingPart {
    switch (statCraftingPartsData.type) {
      case CraftingPartStatType.Attack:
        return new AttackStatCraftingPart(statCraftingPartsData.amount);
      case CraftingPartStatType.Health:
        return new HealthStatCraftingPart(statCraftingPartsData.amount);
      case CraftingPartStatType.Range:
        return new RangeStatCraftingPart(statCraftingPartsData.amount);
      default:
        throw new Error(`unexpected crafting part stat type: ${statCraftingPartsData.type}`);
    }
  }

  static buildAbilityCraftingPart(abilityCraftingPartData: any):AbilityCraftingPart {
    return new AbilityCraftingPart(CardBuilder.buildCardAbility(abilityCraftingPartData.ability));
  }
}