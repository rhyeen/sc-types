import { DungeonFieldSlot } from './field-slot';
import { CardSet } from '../../card/entities/card-set';

export class Dungeon {
  field: DungeonFieldSlot[];

  constructor(field: DungeonFieldSlot[]) {
    this.field = field;
  }

  copy(cardSets: Record<string,CardSet>):Dungeon {
    return new Dungeon(this._copyField(cardSets));
  }

  _copyField(cardSets: Record<string,CardSet>):DungeonFieldSlot[] {
    const result = [];
    for (const fieldSlot of this.field) {
      result.push(fieldSlot.copy(cardSets));
    }
    return result;
  }
}