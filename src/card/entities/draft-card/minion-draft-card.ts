import { DraftCard } from "./draft-card";
import { CardType } from "../../enums/card-type"
import { CardRarity } from "../../enums/card-rarity";
import { DraftCardAbilitySlot } from "../draft-card-ability-slot";
import { MinionCard } from "../card/minion-card";
import { CraftingPart, CraftingPartAttackStat, CraftingPartHealthStat, CraftingPartRangeStat, StatCraftingPart } from "../crafting-part";

export class MinionDraftCard extends DraftCard {
  health: number;
  attack: number;
  range: number;

  constructor(rarity: CardRarity, health: number, attack: number, range: number, slots?: DraftCardAbilitySlot[], cost?: number) {
    super(rarity, CardType.Minion, slots, cost);
    this.health = health;
    this.attack = attack;
    this.range = range;
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
    if (part.stat instanceof CraftingPartHealthStat) {
      this.health = part.stat.amount;
      this.regenerateCost();
      return true;
    }
    if (part.stat instanceof CraftingPartAttackStat) {
      this.attack = part.stat.amount;
      this.regenerateCost();
      return true;
    }
    if (part.stat instanceof CraftingPartRangeStat) {
      this.range = part.stat.amount;
      this.regenerateCost();
      return true;
    }
    throw new Error(`unexpected stat modifier: ${part.stat.type}`);
  }

  regenerateCost() {
    let cost = this.getMinionStatsCost(0);
    return this.finalizeCost(cost);
  }

  private getMinionStatsCost(cost: number):number {
    cost += this.attack * 0.3;
    if (this.range <= 0) {
      cost += -1;
    } else if (this.range == 1) {
      cost += 0;
    } else {
      cost += this.range;
    }
    cost += this.health * 0.25;
    return cost;
  }
}
