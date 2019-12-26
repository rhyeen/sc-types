import { Status } from '../status';
import { PlayerFieldSlot } from '../field-slot';
import { PlayerHand, PlayerDiscardDeck, PlayerDrawDeck, PlayerLostDeck } from './deck';
import { CardSet } from '../../../card/entities/card-set';

export class Player {
  id: string;
  name: string;
  health: Status;
  energy: Status;
  field: PlayerFieldSlot[];
  hand: PlayerHand;
  drawDeck: PlayerDrawDeck;
  discardDeck: PlayerDiscardDeck;
  lostDeck: PlayerLostDeck;

  constructor(id: string, name: string, maxHealth: number, maxEnergy: number, handRefillSize: number) {
    this.id = id;
    this.name = name;
    this.health = new Status(maxHealth);
    this.energy = new Status(maxEnergy);
    this.field = [
      new PlayerFieldSlot(),
      new PlayerFieldSlot(),
      new PlayerFieldSlot()
    ];
    this.hand = new PlayerHand(handRefillSize);
    this.drawDeck = new PlayerDrawDeck();
    this.discardDeck = new PlayerDiscardDeck();
    this.lostDeck = new PlayerLostDeck();
  }

  refresh() {
    this.refreshField();
  }

  private refreshField() {
    for (const fieldSlot of this.field) {
      fieldSlot.refresh();
    }
  }

  drawHand() {
    this.flushHand();
    this.drawFromDrawDeck();
    if (this.hand.size() < this.hand.refillSize) {
      this.shuffleDiscardIntoDrawDeck();
    }
    this.drawFromDrawDeck();
  }

  private drawFromDrawDeck() {
    while (this.hand.size() < this.hand.refillSize && this.drawDeck.size() > 0) {
      this.hand.add(this.drawDeck.remove(0));
    }
  }

  private shuffleDiscardIntoDrawDeck() {
    this.discardDeck.shuffle();
    while (this.discardDeck.size() > 0) {
      this.drawDeck.add(this.discardDeck.remove(0));
    }
  }

  flushHand() {
    while (this.hand.size() > 0) {
      this.discardDeck.add(this.hand.remove(0));
    }
  }

  copy(cardSets: Record<string,CardSet>):Player {
    const player = new Player(this.id, this.name, this.health.max, this.energy.max, this.hand.refillSize);
    player.health = this.health.copy();
    player.energy = this.energy.copy();
    player.field = this.copyField(cardSets);
    player.hand = this.hand.copy(cardSets);
    player.drawDeck = this.drawDeck.copy(cardSets);
    player.discardDeck = this.discardDeck.copy(cardSets);
    player.lostDeck = this.lostDeck.copy(cardSets);
    return player;
  }

  private copyField(cardSets: Record<string,CardSet>):PlayerFieldSlot[] {
    const result = [];
    for (const fieldSlot of this.field) {
      result.push(fieldSlot.copy(cardSets));
    }
    return result;
  }

  json(hidePrivate?: boolean):any {
    return {
      id: this.id,
      name: this.name,
      health: this.health.json(),
      energy: this.energy.json(),
      field: this.jsonField(),
      hand: this.hand.json(),
      drawDeck: this.drawDeck.json(hidePrivate),
      discardDeck: this.discardDeck.json(),
      lostDeck: this.lostDeck.json(),
    }
  }

  private jsonField():any {
    const result = [];
    for (const fieldSlot of this.field) {
      result.push(fieldSlot.json());
    }
    return result;
  }
}