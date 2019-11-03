import { CardAbilityTier } from "../enums/card-ability";
import { CardAbility, VariableCardAbility } from "./card-ability";
import { CraftingPart, AbilityCraftingPart } from "./crafting-part";

export class DraftCardAbilitySlot {
  ability?: CardAbility;

  constructor(ability?: CardAbility) {
    this.ability = ability;
  }

  static copy(slot: DraftCardAbilitySlot):DraftCardAbilitySlot {
    return new DraftCardAbilitySlot(slot.ability.copy());
  }

  isFilled():boolean {
    return !!this.ability.id
  }

  canBeFilled(part: CraftingPart):boolean {
    if (this.isFilled()) {
      return false;
    }
    if (!(part instanceof AbilityCraftingPart)) {
      return false;
    }
    if (this.ability.tier == CardAbilityTier.Godly) {
      return true;
    }
    if (this.ability.tier == CardAbilityTier.Legendary && part.tier != CardAbilityTier.Godly) {
      return true;
    }
    if (this.ability.tier == CardAbilityTier.Minion3) {
      return part.tier == CardAbilityTier.Minion3 || part.tier == CardAbilityTier.Minion2 || part.tier == CardAbilityTier.Minion1;
    }
    if (this.ability.tier == CardAbilityTier.Minion2) {
      return part.tier == CardAbilityTier.Minion2 || part.tier == CardAbilityTier.Minion1;
    }
    if (this.ability.tier == CardAbilityTier.Minion1) {
      return part.tier == CardAbilityTier.Minion1;
    }
    if (this.ability.tier == CardAbilityTier.Spell3) {
      return part.tier == CardAbilityTier.Spell3 || part.tier == CardAbilityTier.Spell2 || part.tier == CardAbilityTier.Spell1;
    }
    if (this.ability.tier == CardAbilityTier.Spell2) {
      return part.tier == CardAbilityTier.Spell2 || part.tier == CardAbilityTier.Spell1;
    }
    if (this.ability.tier == CardAbilityTier.Spell1) {
      return part.tier == CardAbilityTier.Spell1;
    }
    throw new Error(`unexpected ability tier: ${this.ability.tier}`);    
  }

  fill(part: CraftingPart) {
    if (!this.canBeFilled(part)) {
      return;
    }
    if (!(part instanceof AbilityCraftingPart)) {
      return;
    }
    this.ability = part.ability.copy();
  }

  canBeModified(part: CraftingPart):boolean {
    if (!this.isFilled()) {
      return false;
    }
    if (!(part instanceof AbilityCraftingPart)) {
      return;
    }
    if (!part.ability) {
      return false;
    }
    if (this.ability.id != part.ability.id) {
      return false;
    }
    if (!(this.ability instanceof VariableCardAbility)) {
      return false;
    }
    if (!(part.ability instanceof VariableCardAbility)) {
      return false;
    }
    return true;
  }

  modify(part: CraftingPart) {
    if (!this.canBeModified(part)) {
      return;
    }
    if (!(part instanceof AbilityCraftingPart)) {
      return;
    }
    if (!(this.ability instanceof VariableCardAbility)) {
      return;
    }
    if (!(part.ability instanceof VariableCardAbility)) {
      return;
    }
    this.ability.amount += part.ability.amount;
  }
}
