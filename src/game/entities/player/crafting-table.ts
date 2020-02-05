import { CraftingForge } from "./crafting-forge";
import { DraftCard } from "../../../card/entities/draft-card/draft-card";
import { CraftingPart } from "../../../card/entities/crafting-part";
import { CardRarity } from "../../../card/enums/card-rarity";

const DEFAULT_FORGE_SLOTS = 2;
const DEFAULT_BASE_CARDS = 1;
const DEFAULT_CRAFTING_PARTS = 3;
const DEFAULT_MAX_CRAFTING_PARTS_USED = 1;
const DEFAULT_MAX_DRAFTED_INSTANCES = <Record<CardRarity, number>>{};
DEFAULT_MAX_DRAFTED_INSTANCES[CardRarity.Common] = 5;
DEFAULT_MAX_DRAFTED_INSTANCES[CardRarity.Rare] = 3;
DEFAULT_MAX_DRAFTED_INSTANCES[CardRarity.Epic] = 2;
DEFAULT_MAX_DRAFTED_INSTANCES[CardRarity.Legendary] = 1;

export class CraftingTable {
  forge: CraftingForge[];
  baseCards: DraftCard[];
  baseCardsAmount: number;
  craftingParts: CraftingPart[];
  craftingPartsAmount: number;
  maxCraftingPartsUsed: number;
  private _maxDraftedInstances: Record<CardRarity, number>;

  constructor(forgeSlotsAmount?: number, baseCardsAmount?: number, craftingPartsAmount?: number, maxCraftingPartsUsed?: number) {
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
    if (maxCraftingPartsUsed || maxCraftingPartsUsed === 0) {
      this.maxCraftingPartsUsed = maxCraftingPartsUsed;
    } else {
      this.maxCraftingPartsUsed = DEFAULT_MAX_CRAFTING_PARTS_USED;
    }
    this._maxDraftedInstances = DEFAULT_MAX_DRAFTED_INSTANCES;
  }

  get remainingUsableCraftingParts():number {
    return this.maxCraftingPartsUsed - this.craftingPartsUsed;
  }

  get craftingPartsUsed():number {
    return this.craftingPartsAmount - this.craftingParts.length;
  }

  copy():CraftingTable {
    const craftingTable = new CraftingTable(this.forge.length, this.baseCardsAmount, this.craftingPartsAmount, this.maxCraftingPartsUsed);
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
      craftingPartsAmount: this.craftingPartsAmount,
      maxCraftingPartsUsed: this.maxCraftingPartsUsed,
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

  fillForge(forgeSlotIndex, baseCardIndex):DraftCard {
    const card = this.baseCards.splice(baseCardIndex, 1)[0];
    this.forge[forgeSlotIndex].fill(card);
    return card;
  }

  getMaxNumberOfDraftedInstances(cardRarity: CardRarity):number {
    if (!(cardRarity in this._maxDraftedInstances)) {
      throw new Error(`unexpected card rarity: ${cardRarity}`);
    }
    return this._maxDraftedInstances[cardRarity];
  }

  removeCraftingPart(craftingPartIndex: number) {
    this.craftingParts.splice(craftingPartIndex, 1);
  }
}