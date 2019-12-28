import { DraftCard } from "../../entities/draft-card/draft-card";
import { DraftCardAbilitySlot } from "../../entities/draft-card-ability-slot";
import { CardBuilder } from "./card-builder";

export class DraftCardBuilder {
  static buildDraftCard(draftCardData: any):DraftCard {
    const slots = DraftCardBuilder.buildDraftCardSlots(draftCardData.slots);
    return new DraftCard(draftCardData.rarity, draftCardData.type, slots);
  }

  private static buildDraftCardSlots(draftCardSlotsData):DraftCardAbilitySlot[] {
    const result = [];
    for (const draftCardSlotData of draftCardSlotsData) {
      result.push(DraftCardBuilder.buildDraftCardSlot(draftCardSlotData));
    }
    return result;
  }

  private static buildDraftCardSlot(draftCardSlotData):DraftCardAbilitySlot {
    const slot = new DraftCardAbilitySlot(draftCardSlotData.tier);
    if (draftCardSlotData.ability) {
      slot.ability = CardBuilder.buildCardAbility(draftCardSlotData.ability);
    }
    return slot;
  }
}