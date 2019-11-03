import { CardRarity } from "../../enums/card-rarity";
import { DraftCardInterface } from "../../card.interface";
import { CardType } from "../../enums/card-type";
import { DraftCardAbilitySlot } from "../draft-card-ability-slot";
import { Card } from "../card/card";
import { CardAbility, StaticCardAbility, VariableCardAbility } from "../card-ability";
import { CraftingPart, AbilityCraftingPart } from "../crafting-part";
import { StaticCardAbilityId, VariableCardAbilityId } from "../../enums/card-ability";

export class DraftCard implements DraftCardInterface {
  type: CardType;
  rarity: CardRarity;
  slots?: DraftCardAbilitySlot[];
  cost?: number;

  constructor(rarity: CardRarity, cardType: CardType, slots?: DraftCardAbilitySlot[], cost?: number) {
    this.type = cardType;
    this.rarity = rarity;
    if (slots) {
      this.slots = slots;
    } else {
      this.slots = [];
    }
    if (cost) {
      this.cost = cost;
    } else {
      this.cost = 0;
    }
  }

  static copy(draftCard: DraftCard):DraftCard {
    let slots = [];
    for (let slot of draftCard.slots) {
      slots.push(DraftCardAbilitySlot.copy(slot));
    }
    return new DraftCard(draftCard.rarity, draftCard.type, slots, draftCard.cost);
  }

  buildCard():Card {
    throw new Error(`draft card of type ${this.type} is base class, but must be an extended class`);
  }

  protected buildAbilities():CardAbility[] {
    if (!this.slots) {
      return null;
    }
    let cardAbilites = [];
    for (let slot of this.slots) {
      if (slot.isFilled()) {
        cardAbilites.push(slot.ability);
      }
    }
    return cardAbilites;
  }

  buildCost():number {
    return Math.floor(this.cost);
  }

  regenerateCost() {
    return this.finalizeCost(0);
  }

  addCraftingPart(part: CraftingPart):boolean {
    return this.addCraftingPartToSlot(part);
  }

  protected addCraftingPartToSlot(part: CraftingPart):boolean {
    if (!this.craftingPartFitsSlot(part)) {
      return false;
    }
    const matchingSlot = this.getMatchingSlot(part);
    if (matchingSlot != -1) {
      this.slots[matchingSlot].modify(part);
      this.regenerateCost();
      return true;
    }
    const fittedSlot = this.getFittedSlot(part);
    if (fittedSlot != -1) {
      this.slots[fittedSlot].fill(part);
      this.regenerateCost();
      return true;
    }
    return false;
  }

  private craftingPartFitsSlot(part: CraftingPart):boolean {
    if (!this.slots || !this.slots.length) {
      return false;
    }
    return part instanceof AbilityCraftingPart;
  }

  private getMatchingSlot(part: CraftingPart):number {
    for (let i = 0; i < this.slots.length; i+=1) {
      if (this.slots[i].canBeModified(part)) {
        return i;
      }
    }
    return -1;
  }

  private getFittedSlot(part: CraftingPart):number {
    for (let i = 0; i < this.slots.length; i+=1) {
      if (this.slots[i].canBeFilled(part)) {
        return i;
      }
    }
    return -1;
  }

  protected finalizeCost(cost: number):number {
    cost += this.getRarityCost();
    cost += this.getAbilitySlotsCost();
    // @NOTE: we don't want the floor() since we need approximations while still drafting the card.
    if (cost < 0) {
      cost = 0;
    }
    return cost;
  }

  private getRarityCost():number {
    switch (this.rarity) {
      case CardRarity.Common:
        return 0;
      case CardRarity.Rare:
        return -.5;
      case CardRarity.Epic:
        return -1;
      case CardRarity.Legendary:
        return -2;
      default:
        throw new Error(`unexpected rarity: ${this.rarity}`);
    }
  }

  private getAbilitySlotsCost():number {
    let cost = 0;
    if (!this.slots || !this.slots.length) {
      return cost;
    }
    for (let slot of this.slots) {
      if (slot.isFilled()) {
        cost += this.getAbilityCost(slot.ability);
      }
    }
    return cost;
  }

  private getAbilityCost(ability: CardAbility):number {
    if (ability instanceof StaticCardAbility) {
      return this.getStaticAbilityCost(ability);
    } else if (ability instanceof VariableCardAbility) {
      return this.getVariableAbilityCost(ability);
    }
    throw new Error(`unexpected ability instance with id: ${ability.id}`);
  }

  private getStaticAbilityCost(ability: StaticCardAbility):number {
    switch (ability.id) {
      case StaticCardAbilityId.Haste:
        return 1.5;
      default:
        throw new Error(`unexpected static ability with id: ${ability.id}`);
    }
  }

  private getVariableAbilityCost(ability: VariableCardAbility):number {
    switch (ability.id) {
      case VariableCardAbilityId.Reach:
        return ability.amount * 3;
      case VariableCardAbilityId.Spellshot:
        return ability.amount * 2;
      default:
        throw new Error(`unexpected static ability with id: ${ability.id}`);
    }
  }
}
