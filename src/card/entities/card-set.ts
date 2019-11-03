import { Card } from "./card/card";
import { CardInterface, copyCardInterface } from "../card.interface";

export class CardSet {
  baseCard: CardInterface;
  instances: Record<string, Card>;

  constructor(baseCard: CardInterface, instances?: Card[]) {
    this.baseCard = baseCard;
    if (instances) {
      for (const instance of instances) {
        this.setInstance(instance);
      }
    } else {
      this.instances = {};
    }
  }

  hasInstance(id: string): boolean {
    return id in this.instances;
  }

  getInstance(id: string): Card {
    if (!this.hasInstance(id)) {
      throw new Error(`card set does not have the instance ${id}`);
    }
    return this.instances[id];
  }

  setInstance(instance: Card) {
    if (!instance.id) {
      throw new Error(`card instance does not have an id`);
    }
    this.instances[instance.id] = instance;
  }

  copy():CardSet {
    return new CardSet(this._copyBaseCard(), this._copyInstances());
  }

  _copyBaseCard():CardInterface {
    return copyCardInterface(this.baseCard);
  }

  _copyInstances():Card[] {
    const result = [];
    for (const key in this.instances) {
      result.push(this.instances[key].copy());
    }
    return result;
  }
}
