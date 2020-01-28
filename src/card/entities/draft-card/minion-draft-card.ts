import { DraftCard } from "./draft-card";
import { CardType } from "../../enums/card-type"
import { CardRarity } from "../../enums/card-rarity";
import { DraftCardAbilitySlot } from "../draft-card-ability-slot";
import { MinionCard } from "../card/minion-card";
import { CraftingPart, StatCraftingPart, AttackStatCraftingPart, HealthStatCraftingPart, RangeStatCraftingPart } from "../crafting-part";

export class MinionDraftCard extends DraftCard {
  _health: number;
  _attack: number;
  _range: number;

  constructor(rarity: CardRarity, health: number, attack: number, range: number, slots?: DraftCardAbilitySlot[]) {
    super(rarity, CardType.Minion, slots);
    this._health = health;
    this._attack = attack;
    this._range = range;
  }

  get health():number {
    if (!this._health || this._health < 0) {
      return 0;
    }
    return this._health;
  }

  get remainingHealth():number {
    return this.health;
  }

  get attack():number {
    if (!this._attack || this._attack < 0) {
      return 0;
    }
    return this._attack;
  }

  get range():number {
    if (!this._range || this._range < 0) {
      return 0;
    }
    return this._range;
  }

  buildCard():MinionCard {
    return new MinionCard(this.rarity, this.health, this.attack, this.range, this.buildAbilities(), this.buildCost());
  }

  addCraftingPart(part: CraftingPart):boolean {
    if (this.addCraftingPartToSlot(part)) {
      return true;
    }
    if (!(part instanceof StatCraftingPart)) {
      return false;
    }
    if (part instanceof HealthStatCraftingPart) {
      this._health += part.amount;
      this.regenerateCost();
      return true;
    }
    if (part instanceof AttackStatCraftingPart) {
      this._attack += part.amount;
      this.regenerateCost();
      return true;
    }
    if (part instanceof RangeStatCraftingPart) {
      this._range += part.amount;
      this.regenerateCost();
      return true;
    }
    throw new Error(`unexpected stat modifier: ${part.type}`);
  }

  regenerateCost() {
    const cost = this.getMinionStatsCost(0);
    this._cost = this.finalizeCost(cost);
  }

  private getMinionStatsCost(cost: number):number {
    let _cost = cost;
    _cost += this.attack * 0.3;
    if (this.range <= 0) {
      _cost += -1;
    } else if (this.range === 1) {
      _cost += 0;
    } else {
      _cost += this.range;
    }
    _cost += this.health * 0.25;
    return _cost;
  }

  copy():MinionDraftCard {
    return new MinionDraftCard(this.rarity, this.health, this.attack, this.range, this.copySlots());
  }

  json():any {
    return {
      type: this.type,
      rarity: this.rarity,
      health: this.health,
      attack: this.attack,
      range: this.range,
      slots: this.jsonSlots()
    };
  }
}
