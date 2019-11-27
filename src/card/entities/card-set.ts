import { Card } from "./card/card";
import { CardInterface, copyCardInterface } from "../card.interface";
import { CardHasher } from "../services/card-hasher";
import { CardBuilder } from "../services/card-builder";

export class CardSet {
  baseCard: CardInterface;
  instances: Record<string, Card>;

  constructor(baseCard: CardInterface, instances?: Card[]) {
    this.baseCard = baseCard;
    this.instances = {};
    if (instances) {
      for (const instance of instances) {
        this.setInstance(instance);
      }
    }
    if (!this.baseCard.hash) {
      this.baseCard.hash = CardHasher.getCardHash(this.baseCard);
    }
  }

  hasInstance(id: string): boolean {
    return id in this.instances;
  }

  getInstances(): Card[] {
    const cards = [];
    for (let key in this.instances) {
      cards.push(this.instances[key]);
    }
    return cards;
  }

  getInstance(id: string): Card {
    if (!this.hasInstance(id)) {
      throw new Error(`card set does not have the instance ${id}`);
    }
    return this.instances[id];
  }

  createInstance() {
    const instance = CardBuilder.buildCard(this.baseCard);
    this.instances[instance.id] = instance;
    return this.instances[instance.id];
  }

  setInstance(instance: Card) {
    if (!instance.id) {
      throw new Error(`card instance does not have an id`);
    }
    this.instances[instance.id] = instance;
  }

  copy():CardSet {
    return new CardSet(this.copyBaseCard(), this.copyInstances());
  }

  private copyBaseCard():CardInterface {
    return copyCardInterface(this.baseCard);
  }

  private copyInstances():Card[] {
    const result = [];
    for (const key in this.instances) {
      result.push(this.instances[key].copy());
    }
    return result;
  }

  json(reduce?: boolean):any {
    return {
      baseCard: this.baseCard,
      instances: this.jsonInstances(reduce)
    }
  }

  private jsonInstances(reduce?: boolean):any {
    const result = [];
    for (const key in this.instances) {
      result.push(this.instances[key].json(reduce));
    }
    return result;
  }
}
