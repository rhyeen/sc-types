import { CardAbilityTier } from "../enums/card-ability";
import { CardAbility, VariableCardAbility } from "./card-ability";
import { CraftingPart, AbilityCraftingPart } from "./crafting-part";

export class DraftCardAbilitySlot {
  _ability?: CardAbility;

  constructor(tier?: CardAbilityTier) {
    this.tier = tier;
  }

  set ability(ability: CardAbility) {
    let tier = this._ability.tier;
    if (ability.tier) {
      tier = ability.tier;
    }
    this._ability = ability;
    this._ability.tier = tier;
  }

  get ability():CardAbility {
    return this._ability;
  }

  set tier(tier: CardAbilityTier) {
    if (!this._ability) {
      this._ability = new CardAbility(null);
    }
    this._ability.tier = tier;
  }

  get tier():CardAbilityTier {
    return this._ability.tier;
  }

  copy():DraftCardAbilitySlot {
    const copiedSlot = new DraftCardAbilitySlot();
    copiedSlot.ability = this.ability.copy();
    return copiedSlot;
  }

  json():any {
    const result = {
      tier: this.tier
    };
    if (this.isFilled()) {
      result['ability'] = this.ability.json();
    }
    return result;
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
    if (this.tier === CardAbilityTier.Godly) {
      return true;
    }
    if (this.tier === CardAbilityTier.Legendary && part.tier !== CardAbilityTier.Godly) {
      return true;
    }
    if (this.tier === CardAbilityTier.Minion3) {
      return part.tier === CardAbilityTier.Minion3 || part.tier === CardAbilityTier.Minion2 || part.tier === CardAbilityTier.Minion1;
    }
    if (this.tier === CardAbilityTier.Minion2) {
      return part.tier === CardAbilityTier.Minion2 || part.tier === CardAbilityTier.Minion1;
    }
    if (this.tier === CardAbilityTier.Minion1) {
      return part.tier === CardAbilityTier.Minion1;
    }
    if (this.tier === CardAbilityTier.Spell3) {
      return part.tier === CardAbilityTier.Spell3 || part.tier === CardAbilityTier.Spell2 || part.tier === CardAbilityTier.Spell1;
    }
    if (this.tier === CardAbilityTier.Spell2) {
      return part.tier === CardAbilityTier.Spell2 || part.tier === CardAbilityTier.Spell1;
    }
    if (this.tier === CardAbilityTier.Spell1) {
      return part.tier === CardAbilityTier.Spell1;
    }
    throw new Error(`unexpected ability tier: ${this.tier}`);    
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
      return false;
    }
    if (!part.ability) {
      return false;
    }
    if (this.ability.id !== part.ability.id) {
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
