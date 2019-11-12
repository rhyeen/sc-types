import { DungeonFieldSlot } from './field-slot';
import { CardSet } from '../../card/entities/card-set';

export class Dungeon {
  field: DungeonFieldSlot[];

  constructor(field: DungeonFieldSlot[]) {
    this.field = field;
  }

  copy(cardSets: Record<string,CardSet>):Dungeon {
    return new Dungeon(this.copyField(cardSets));
  }

  private copyField(cardSets: Record<string,CardSet>):DungeonFieldSlot[] {
    const result = [];
    for (const fieldSlot of this.field) {
      result.push(fieldSlot.copy(cardSets));
    }
    return result;
  }

  json(hidePrivate?: boolean):any {
    return {
      field: this.jsonField(hidePrivate)
    };
  }

  private jsonField(hidePrivate?: boolean):any {
    const result = [];
    for (const fieldSlot of this.field) {
      result.push(fieldSlot.json(hidePrivate));
    }
    return result;
  }
}