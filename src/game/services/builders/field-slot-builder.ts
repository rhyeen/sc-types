import { PlayerFieldSlot, DungeonFieldSlot } from "../../entities/field-slot";
import { CardSet } from "../../../card/entities/card-set";
import { CardIdentifier } from "../../../card/services/card-identifier";
import { Card } from "../../../card/entities/card/card";

export class FieldSlotBuilder {
  static buildPlayerFieldSlot(playerFieldSlotData: any, cardSets: Record<string, CardSet>):PlayerFieldSlot {
    const card = FieldSlotBuilder.buildCard(playerFieldSlotData.card, cardSets);
    return new PlayerFieldSlot(card);
  }

  static buildDungeonFieldSlot(dungeonFieldSlotData: any, cardSets: Record<string, CardSet>):DungeonFieldSlot {
    const card = FieldSlotBuilder.buildCard(dungeonFieldSlotData.card, cardSets);
    const backlog = FieldSlotBuilder.buildBacklog(dungeonFieldSlotData.backlog, cardSets);
    return new DungeonFieldSlot(card, backlog);
  }

  private static buildBacklog(backlog: any[], cardSets: Record<string, CardSet>):Card[] {
    const cards = [];
    for (const card of backlog) {
      cards.push(FieldSlotBuilder.buildCard(card, cardSets));
    }
    return cards;
  }

  private static buildCard(cardData: any, cardSets: Record<string, CardSet>):Card {
    if (!cardData) {
      return null;
    }
    return CardIdentifier.findCardFromIds(cardData.id, cardData.hash, cardSets);
  }
}