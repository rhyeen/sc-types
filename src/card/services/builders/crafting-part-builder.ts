import { StatCraftingPart, AttackStatCraftingPart, HealthStatCraftingPart, RangeStatCraftingPart } from "../../entities/crafting-part";
import { CraftingPartStatType } from "../../enums/crafting-part";

export interface StatPartData {
  type: CraftingPartStatType;
  amount: number;
}

export class CraftingPartBuilder {
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
}