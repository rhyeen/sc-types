import { CraftingTable } from "../../entities/player/crafting-table";
import { DraftCard } from "../../../card/entities/draft-card/draft-card";
import { CraftingForge } from "../../entities/player/crafting-forge";
import { CraftingPart } from "../../../card/entities/crafting-part";
import { DraftCardBuilder } from "../../../card/services/builders/draft-card-builder";
import { CraftingPartBuilder } from "../../../card/services/builders/crafting-part-builder";

export class CraftingTableBuilder {
  static buildCraftingTable(craftingTableData: any):CraftingTable {
    if (!craftingTableData) {
      return new CraftingTable();
    }
    const craftingTable = new CraftingTable(craftingTableData.forge.length, craftingTableData.baseCardsAmount, craftingTableData.craftingPartsAmount);
    craftingTable.baseCards = CraftingTableBuilder.buildBaseCards(craftingTableData.baseCards);
    craftingTable.forge = CraftingTableBuilder.buildForge(craftingTableData.forge);
    craftingTable.craftingParts = CraftingTableBuilder.buildCraftingParts(craftingTableData.craftingParts);
    return craftingTable;
  }

  private static buildBaseCards(baseCardsData: any[]): DraftCard[] {
    const result = [];
    for (const baseCardData of baseCardsData) {
      result.push(DraftCardBuilder.buildDraftCard(baseCardData));
    }
    return result;
  }

  private static buildForge(forgeData: any[]): CraftingForge[] {
    const result = [];
    for (const forgeSlotData of forgeData) {
      result.push(CraftingTableBuilder.buildForgeSlot(forgeSlotData));
    }
    return result;
  }

  private static buildForgeSlot(forgeSlotData: any): CraftingForge {
    if (!forgeSlotData.card) {
      return new CraftingForge();
    }
    return new CraftingForge(DraftCardBuilder.buildDraftCard(forgeSlotData.card));
  }

  private static buildCraftingParts(craftingPartsData: any[]): CraftingPart[] {
    const result = [];
    for (const craftingPartData of craftingPartsData) {
      result.push(CraftingPartBuilder.buildCraftingPart(craftingPartData));
    }
    return result;
  }
}