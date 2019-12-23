import { PlayerFieldSlot, DungeonFieldSlot, HiddenDungeonFieldSlot } from "../../entities/field-slot";
import { CardSet } from "../../../card/entities/card-set";
import { CardFinder } from "../../../card/services/card-finder";
import { Card } from "../../../card/entities/card/card";

export class FieldSlotBuilder {
  static buildPlayerFieldSlot(playerFieldSlotData: any, cardSets: Record<string, CardSet>):PlayerFieldSlot {
    const card = FieldSlotBuilder.buildCard(playerFieldSlotData.card, cardSets);
    return new PlayerFieldSlot(card);
  }

  static buildDungeonFieldSlot(dungeonFieldSlotData: any, cardSets: Record<string, CardSet>):DungeonFieldSlot {
    const card = FieldSlotBuilder.buildCard(dungeonFieldSlotData.card, cardSets);
    if (dungeonFieldSlotData.backlog.size || dungeonFieldSlotData.backlog.size === 0) {
      return new HiddenDungeonFieldSlot(card, dungeonFieldSlotData.backlog.size);
    }
    const backlog = FieldSlotBuilder.buildBacklog(dungeonFieldSlotData.backlog, cardSets);
    return new DungeonFieldSlot(card, backlog);
  }

  private static buildBacklog(backlogData: any, cardSets: Record<string, CardSet>):Card[] {
    const cards = [];
    for (const card of backlogData.cards) {
      cards.push(FieldSlotBuilder.buildCard(card, cardSets));
    }
    return cards;
  }

  private static buildCard(cardData: any, cardSets: Record<string, CardSet>):Card {
    if (!cardData) {
      return null;
    }
    return CardFinder.findCardFromIds(cardData.id, cardData.hash, cardSets);
  }
}