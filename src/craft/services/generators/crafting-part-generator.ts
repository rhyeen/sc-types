import { CraftingPart } from "../../../card/entities/crafting-part";
import { Game } from "../../../game/entities/game";
import { CraftingPartType } from "../../../card/enums/crafting-part";
import { WeightSelector, Weight, WeightRangesPercentComplete } from "./weight-selector";
import { CardRarity } from "../../../card/enums/card-rarity";

interface PartTypeWeight extends Weight {
  value: CraftingPartType;
}

interface CardRarityWeight extends Weight {
  value: CardRarity;
}

interface CardRarityWeightRanges extends WeightRangesPercentComplete {
  weights: CardRarityWeight[];
}

export interface RandomConditions {
  partType: PartTypeWeight[];
  cardRarity: CardRarityWeightRanges[];
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
    return new CraftingPart();
  }

  private getRandomPartType():CraftingPartType {
    return WeightSelector.select(this.randomConditions.partType).value;
  }

  private getRandomCardRarity(game: Game):CardRarity {
    const weights = WeightSelector.getWeightsBasedOnPercentComplete(this.randomConditions.cardRarity, WeightSelector.getPercentComplete(game));
    return WeightSelector.select(weights).value;
  }
}