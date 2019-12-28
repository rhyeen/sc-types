import { DraftCard } from "../../../card/entities/draft-card/draft-card";
import { CardType } from "../../../card/enums/card-type";
import { WeightSelector, Weight, WeightRangesPercentComplete, WeightRangesCardRarity } from "./weight-selector";
import { CardRarity } from "../../../card/enums/card-rarity";
import { MinionDraftCard } from "../../../card/entities/draft-card/minion-draft-card";
import { Game } from "../../../game/entities/game";
import { SpellDraftCard } from "../../../card/entities/draft-card/spell-draft-card";
import { CardAbility } from "../../../card/entities/card-ability";
import { DraftCardAbilitySlot } from "../../../card/entities/draft-card-ability-slot";
import { CardBuilder } from "../../../card/services/builders/card-builder";
import { CardAbilityTier } from "../../../card/enums/card-ability";

interface CardTypeWeight extends Weight {
  value: CardType;
}

interface CardRarityWeight extends Weight {
  value: CardRarity;
}

interface MinionStats {
  health: number;
  attack: number;
  range: number;
}

interface Ability {
  id: string;
  amount: number;
}

interface Slot {
  tier: CardAbilityTier;
}

interface MinionStatsWeight extends Weight {
  value: MinionStats;
}

interface AbilitiesWeight extends Weight {
  value: Ability[];
}

interface SlotsWeight extends Weight {
  value: Slot[];
}

interface CardRarityWeightRanges extends WeightRangesPercentComplete {
  weights: CardRarityWeight[];
}

interface MinionStatsWeightRanges extends WeightRangesCardRarity {
  weights: MinionStatsWeight[];
}

interface AbilitiesWeightRanges extends WeightRangesCardRarity {
  weights: AbilitiesWeight[];
}

interface SlotsWeightRanges extends WeightRangesCardRarity {
  weights: SlotsWeight[];
}

export interface RandomConditions {
  cardType: CardTypeWeight[];
  cardRarity: CardRarityWeightRanges[];
  minionStats: MinionStatsWeightRanges[];
  minionAbilities: AbilitiesWeightRanges[];
  minionSlots: SlotsWeightRanges[];
  spellAbilities: AbilitiesWeightRanges[];
  spellSlots: SlotsWeightRanges[];
}

export class BaseDraftCardGenerator {
  randomConditions: RandomConditions;

  constructor(randomConditions: RandomConditions) {
    this.randomConditions = randomConditions;
  }

  // @MUTATES: game
  setGeneratedBaseDraftCard(game: Game) {
    const baseCards = this.generateBaseDraftCards(game);
    game.player.craftingTable.baseCards = baseCards;
  }

  generateBaseDraftCards(game: Game):DraftCard[] {
    const numberOfCards = this.getNumberOfBaseDraftCard(game);
    const cards = [];
    for (let i = 0; i < numberOfCards; i++) {
      cards.push(this.generateBaseDraftCard(game));
    }
    return cards;
  }

  private getNumberOfBaseDraftCard(game: Game):number {
    return game.player.craftingTable.baseCardsAmount;
  }

  generateBaseDraftCard(game: Game):DraftCard {
    const cardType = this.getRandomCardType();
    const rarity = this.getRandomCardRarity(game);
    switch (cardType) {
      case CardType.Minion:
        return this.generateBaseMinionDraftCard(rarity);
      case CardType.Spell:
        return this.generateBaseSpellDraftCard(rarity);
      default:
        throw new Error(`unexpected random card type: ${cardType}`);
    }
  }

  private getRandomCardType():CardType {
    return WeightSelector.select(this.randomConditions.cardType).value;
  }

  private getRandomCardRarity(game: Game):CardRarity {
    const weights = WeightSelector.getWeightsBasedOnPercentComplete(this.randomConditions.cardRarity, WeightSelector.getPercentComplete(game));
    return WeightSelector.select(weights).value;
  }

  private generateBaseMinionDraftCard(rarity: CardRarity):MinionDraftCard {
    const { health, attack, range } = this.getRandomMinionStats(rarity);
    const abilities = this.getRandomMinionAbilities(rarity);
    const slots = this.getRandomMinionAbilitySlots(rarity, abilities);
    return new MinionDraftCard(rarity, health, attack, range, slots);
  }

  private getRandomMinionStats(rarity: CardRarity):MinionStats {
    const weights = WeightSelector.getWeightsBasedOnCardRarity(this.randomConditions.minionStats, rarity);
    return WeightSelector.select(weights).value;
  }

  private getRandomMinionAbilities(rarity: CardRarity):CardAbility[] {
    const weights = WeightSelector.getWeightsBasedOnCardRarity(this.randomConditions.minionAbilities, rarity);
    const abilitiesData = WeightSelector.select(weights).value;
    return CardBuilder.buildCardAbilities(abilitiesData);
  }

  private getRandomMinionAbilitySlots(rarity: CardRarity, abilities: CardAbility[]):DraftCardAbilitySlot[] {
    const weights = WeightSelector.getWeightsBasedOnCardRarity(this.randomConditions.minionSlots, rarity);
    const slotsData = WeightSelector.select(weights).value;
    const slots = [];
    for (const slotData of slotsData) {
      slots.push(new DraftCardAbilitySlot(slotData.tier));
    }
    BaseDraftCardGenerator.fillSlots(slots, abilities);
    return slots;
  }

  private static fillSlots(slots: DraftCardAbilitySlot[], abilities: CardAbility[]):DraftCardAbilitySlot[] {
    if (!abilities || !abilities.length) {
      return slots;
    }
    const newSlots = [];
    if (!slots || !slots.length || slots.length <= abilities.length) {
      for (const ability of abilities) {
        const slot = new DraftCardAbilitySlot();
        slot.ability = ability;
        newSlots.push(slot);
      }
      return newSlots;
    }
    for (let i = 0; i < slots.length; i++) {
      if (i < abilities.length) {
        const slot = new DraftCardAbilitySlot();
        slot.ability = abilities[i];
        newSlots.push(slot);
      } else {
        newSlots.push(slots[i]);
      }
    }
    return newSlots;
  }

  private generateBaseSpellDraftCard(rarity: CardRarity):SpellDraftCard {
    const abilities = this.getRandomSpellAbilities(rarity);
    const slots = this.getRandomSpellAbilitySlots(rarity, abilities);
    return new SpellDraftCard(rarity, slots);
  }

  private getRandomSpellAbilities(rarity: CardRarity):CardAbility[] {
    const weights = WeightSelector.getWeightsBasedOnCardRarity(this.randomConditions.spellAbilities, rarity);
    const abilitiesData = WeightSelector.select(weights).value;
    return CardBuilder.buildCardAbilities(abilitiesData);
  }

  private getRandomSpellAbilitySlots(rarity: CardRarity, abilities: CardAbility[]):DraftCardAbilitySlot[] {
    const weights = WeightSelector.getWeightsBasedOnCardRarity(this.randomConditions.spellSlots, rarity);
    const slotsData = WeightSelector.select(weights).value;
    const slots = [];
    for (const slotData of slotsData) {
      slots.push(new DraftCardAbilitySlot(slotData.tier));
    }
    BaseDraftCardGenerator.fillSlots(slots, abilities);
    return slots;
  }
}