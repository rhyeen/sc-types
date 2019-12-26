import { CraftingPart, AbilityCraftingPart, StatCraftingPart } from "../../../card/entities/crafting-part";
import { Game } from "../../../game/entities/game";
import { CraftingPartType } from "../../../card/enums/crafting-part";
import { WeightSelector, Weight, WeightRangesPercentComplete, WeightRangesCardRarity } from "./weight-selector";
import { CardRarity } from "../../../card/enums/card-rarity";
import { CardBuilder } from "../../../card/services/builders/card-builder";
import { CraftingPartBuilder, StatPartData } from "../../../card/services/builders/crafting-part-builder";

interface AbilityPart {
  id: string;
  amount: number;
}

interface PartTypeWeight extends Weight {
  value: CraftingPartType;
}

interface CardRarityWeight extends Weight {
  value: CardRarity;
}

interface StatCraftingPartsWeight extends Weight {
  value: StatPartData[];
}

interface AbilityCraftingPartsWeight extends Weight {
  value: AbilityPart[];
}

interface CardRarityWeightRanges extends WeightRangesPercentComplete {
  weights: CardRarityWeight[];
}

interface StatCraftingPartsWeightRanges extends WeightRangesCardRarity {
  weights: StatCraftingPartsWeight[];
}

interface AbilityCraftingPartsWeightRanges extends WeightRangesCardRarity {
  weights: AbilityCraftingPartsWeight[];
}

export interface RandomConditions {
  partType: PartTypeWeight[];
  cardRarity: CardRarityWeightRanges[];
  statCraftingParts: StatCraftingPartsWeightRanges[];
  abilityCraftingParts: AbilityCraftingPartsWeightRanges[];
}

const DEFAULT_NUMBER_OF_CRAFTING_PARTS = 3;

export class CraftingPartGenerator {
  randomConditions: RandomConditions;

  constructor(randomConditions: RandomConditions) {
    this.randomConditions = randomConditions;
  }

  generateCraftingParts(game: Game):CraftingPart[] {
    const numberOfParts = this.getNumberOfCraftingParts(game);
    const parts = [];
    for (let i = 0; i < numberOfParts; i++) {
      parts.push(this.generateCraftingPart(game));
    }
    return parts;
  }

  private getNumberOfCraftingParts(game: Game):number {
    // @TODO: check player relics
    return DEFAULT_NUMBER_OF_CRAFTING_PARTS;
  }

  generateCraftingPart(game: Game):CraftingPart {
    const partType = this.getRandomPartType();
    const rarity = this.getRandomCardRarity(game);
    switch (partType) {
      case CraftingPartType.Ability:
        return this.generateAbilityCraftingPart(rarity);
      case CraftingPartType.Stat:
        return this.generateStatCraftingPart(rarity);
      default:
        throw new Error(`unexpected random part type: ${partType}`);
    }
  }

  private getRandomPartType():CraftingPartType {
    return WeightSelector.select(this.randomConditions.partType).value;
  }

  private getRandomCardRarity(game: Game):CardRarity {
    const weights = WeightSelector.getWeightsBasedOnPercentComplete(this.randomConditions.cardRarity, WeightSelector.getPercentComplete(game));
    return WeightSelector.select(weights).value;
  }

  private generateAbilityCraftingPart(rarity: CardRarity):AbilityCraftingPart {
    const weights = WeightSelector.getWeightsBasedOnCardRarity(this.randomConditions.abilityCraftingParts, rarity);
    const abilityData = WeightSelector.select(weights).value;
    return new AbilityCraftingPart(CardBuilder.buildCardAbility(abilityData));
  }

  private generateStatCraftingPart(rarity: CardRarity): StatCraftingPart {
    const weights = WeightSelector.getWeightsBasedOnCardRarity(this.randomConditions.statCraftingParts, rarity);
    const statCraftingPartsData = WeightSelector.select(weights).value;
    return CraftingPartBuilder.buildStatCraftingPart(statCraftingPartsData);
  }
}