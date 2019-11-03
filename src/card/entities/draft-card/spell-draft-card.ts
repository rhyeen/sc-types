import { DraftCard } from "./draft-card";
import { CardType } from "../../enums/card-type"
import { CardRarity } from "../../enums/card-rarity";
import { DraftCardAbilitySlot } from "../draft-card-ability-slot";
import { SpellCard } from "../card/spell-card";

export class SpellDraftCard extends DraftCard {
  constructor(rarity: CardRarity, slots?: DraftCardAbilitySlot[], cost?: number) {
    super(rarity, CardType.Spell, slots, cost);
  }

  buildSpellCard():SpellCard {
    return new SpellCard(this.rarity, this.buildAbilities(), this.buildCost());
  }

  regenerateCost() {
    let cost = this.getSpellStatsCost(0);
    return this.finalizeCost(cost);
  }

  private getSpellStatsCost(cost: number):number {
    // @NOTE: there are none, yet.
    return cost;
  }
}
