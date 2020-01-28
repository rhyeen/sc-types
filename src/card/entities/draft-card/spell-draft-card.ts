import { DraftCard } from "./draft-card";
import { CardType } from "../../enums/card-type"
import { CardRarity } from "../../enums/card-rarity";
import { DraftCardAbilitySlot } from "../draft-card-ability-slot";
import { SpellCard } from "../card/spell-card";
import { CraftingPart } from "../crafting-part";

export class SpellDraftCard extends DraftCard {
  constructor(rarity: CardRarity, slots?: DraftCardAbilitySlot[]) {
    super(rarity, CardType.Spell, slots);
  }

  buildCard():SpellCard {
    return new SpellCard(this.rarity, this.buildAbilities(), this.buildCost());
  }

  addCraftingPart(part: CraftingPart):boolean {
    return this.addCraftingPartToSlot(part);
  }

  regenerateCost() {
    const cost = this.getSpellStatsCost(0);
    this._cost = this.finalizeCost(cost);
  }

  private getSpellStatsCost(cost: number):number {
    // @NOTE: there are none, yet.
    return cost;
  }

  copy():SpellDraftCard {
    return new SpellDraftCard(this.rarity, this.copySlots());
  }

  json():any {
    return {
      type: this.type,
      rarity: this.rarity,
      slots: this.jsonSlots()
    };
  }
}
