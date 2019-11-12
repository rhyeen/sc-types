import { Status } from '../status';
import { PlayerFieldSlot } from '../field-slot';
import { PlayerHand, PlayerDiscardDeck, PlayerDrawDeck, PlayerLostDeck } from './deck';
import { CardSet } from '../../../card/entities/card-set';

export class Player {
  health: Status;
  energy: Status;
  field: PlayerFieldSlot[];
  hand: PlayerHand;
  drawDeck: PlayerDrawDeck;
  discardDeck: PlayerDiscardDeck;
  lostDeck: PlayerLostDeck;

  constructor(maxHealth: number, maxEnergy: number, handRefillSize: number) {
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

  copy(cardSets: Record<string,CardSet>):Player {
    const player = new Player(this.health.max, this.energy.max, this.hand.refillSize);
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

  json(reduce?: boolean, hidePrivate?: boolean):any {
    return {
      health: this.health.json(reduce),
      energy: this.energy.json(reduce),
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