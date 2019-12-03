import { Dungeon } from "../../entities/dungeon";
import { CardSet } from "../../../card/entities/card-set";
import { DungeonFieldSlot } from "../../entities/field-slot";
import { FieldSlotBuilder } from "./field-slot-builder";

export class DungeonBuilder {
  static buildDungeon(dungeonData: any, cardSets: Record<string, CardSet>):Dungeon {
    const field = DungeonBuilder.buildField(dungeonData.field, cardSets);
    return new Dungeon(field);
  }

  private static buildField(fieldData: any[], cardSets: Record<string, CardSet>):DungeonFieldSlot[] {
    const field = [];
    for (const slot of fieldData) {
      field.push(FieldSlotBuilder.buildDungeonFieldSlot(slot, cardSets));
    }
    return field;
  }
}