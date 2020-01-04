import { DraftCard } from "../../entities/draft-card/draft-card";
import { DraftCardAbilitySlot } from "../../entities/draft-card-ability-slot";
import { CardBuilder } from "./card-builder";
import { CardType } from "../../enums/card-type";
import { MinionDraftCard } from "../../entities/draft-card/minion-draft-card";
import { SpellDraftCard } from "../../entities/draft-card/spell-draft-card";

export class DraftCardBuilder {
  static buildDraftCard(draftCardData: any):DraftCard {
    const slots = DraftCardBuilder.buildDraftCardSlots(draftCardData.slots);
    switch (draftCardData.type) {
      case CardType.Minion:
        return new MinionDraftCard(draftCardData.rarity, draftCardData.health, draftCardData.attack, draftCardData.range, slots);
      case CardType.Spell:
        return new SpellDraftCard(draftCardData.rarity, slots);
      default:
        throw new Error(`unexpected draft card type: ${draftCardData.type}`);
    }
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