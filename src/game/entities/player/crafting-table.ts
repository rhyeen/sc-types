import { CraftingForge } from "./crafting-forge";
import { DraftCard } from "../../../card/entities/draft-card/draft-card";
import { CraftingPart } from "../../../card/entities/crafting-part";

const DEFAULT_FORGE_SLOTS = 2;
const DEFAULT_BASE_CARDS = 1;
const DEFAULT_CRAFTING_PARTS = 3;

export class CraftingTable {
  forge: CraftingForge[];
  baseCards: DraftCard[];
  baseCardsAmount: number;
  craftingParts: CraftingPart[];
  craftingPartsAmount: number;

  constructor(forgeSlotsAmount?: number, baseCardsAmount?: number, craftingPartsAmount?: number) {
    this.forge = [];
    let _forgeSlotsAmount = DEFAULT_FORGE_SLOTS;
    if (forgeSlotsAmount || forgeSlotsAmount === 0) {
      _forgeSlotsAmount = forgeSlotsAmount;
    }
    for (let i = 0; i < _forgeSlotsAmount; i++) {
      this.forge.push(new CraftingForge());
    }

    this.baseCards = [];
    if (baseCardsAmount || baseCardsAmount === 0) {
      this.baseCardsAmount = baseCardsAmount;
    } else {
      this.baseCardsAmount = DEFAULT_BASE_CARDS;
    }

    this.craftingParts = [];
    if (craftingPartsAmount || craftingPartsAmount === 0) {
      this.craftingPartsAmount = craftingPartsAmount;
    } else {
      this.craftingPartsAmount = DEFAULT_CRAFTING_PARTS;
    }
  }

  copy():CraftingTable {
    const craftingTable = new CraftingTable(this.forge.length, this.baseCardsAmount, this.craftingPartsAmount);
    craftingTable.baseCards = this.copyBaseCards();
    craftingTable.forge = this.copyForge();
    craftingTable.craftingParts = this.copyCraftingParts();
    return craftingTable;
  }

  private copyBaseCards():DraftCard[] {
    const result = [];
    for (const card of this.baseCards) {
      result.push(card.copy());
    }
    return result;
  }

  private copyForge():CraftingForge[] {
    const result = [];
    for (const forgeSlot of this.forge) {
      result.push(forgeSlot.copy());
    }
    return result;
  }

  private copyCraftingParts():CraftingPart[] {
    const result = [];
    for (const craftingPart of this.craftingParts) {
      result.push(craftingPart.copy());
    }
    return result;
  }

  json(): any {
    return {
      forge: this.jsonForge(),
      baseCards: this.jsonBaseCards(),
      baseCardsAmount: this.baseCardsAmount,
      craftingParts: this.jsonCraftingParts(),
      craftingPartsAmount: this.craftingPartsAmount
    };
  }
  
  jsonBaseCards():DraftCard[] {
    const result = [];
    for (const card of this.baseCards) {
      result.push(card.json());
    }
    return result;
  }

  jsonForge():CraftingForge[] {
    const result = [];
    for (const forgeSlot of this.forge) {
      result.push(forgeSlot.json());
    }
    return result;
  }

  jsonCraftingParts():CraftingPart[] {
    const result = [];
    for (const craftingPart of this.craftingParts) {
      result.push(craftingPart.json());
    }
    return result;
  }
}