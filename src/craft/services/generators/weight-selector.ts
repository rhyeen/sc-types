import { CardRarity } from "../../../card/enums/card-rarity";
import { Game } from "../../../game/entities/game";

export interface Weight {
  weight: number;
  value: any;
}

interface WeightRanges {
  weights: Weight[]
}

export interface WeightRangesPercentComplete extends WeightRanges {
  percentComplete: number;
}

export interface WeightRangesCardRarity extends WeightRanges {
  cardRarity: CardRarity;
}

export class WeightSelector {
  static select(weights: Weight[]):Weight {
    const lotteryNumber = WeightSelector.selectWinningLotteryNumber(weights);
    let currentWeightTotal = 0;
    for (const weight of weights) {
      if (lotteryNumber <= weight.weight + currentWeightTotal) {
        return weight;
      }
      currentWeightTotal += weight.weight;
    }
    throw new Error(`failed to find a weight associated with the winning lottery: ${lotteryNumber}`);
  }

  private static selectWinningLotteryNumber(weights: Weight[]):number {
    const totalWeights = weights.reduce((total, curr) => total + curr.weight, 0);
    return Math.random() * totalWeights;
  }

  static getWeightsBasedOnPercentComplete(weightRanges: WeightRangesPercentComplete[], percentComplete: number): Weight[] {
    for (const range of weightRanges) {
      if (percentComplete <= range.percentComplete) {
        return range.weights;
      }
    }
    return weightRanges[weightRanges.length - 1].weights;
  }

  static getWeightsBasedOnCardRarity(weightRanges: WeightRangesCardRarity[], rarity: CardRarity):Weight[] {
    for (const range of weightRanges) {
      if (rarity <= range.cardRarity) {
        return range.weights;
      }
    }
    throw new Error(`unexpected rarity: ${rarity} for given weightRanges`);
  }


  static getPercentComplete(game: Game):number {
    const initialDungeonMinionCards = WeightSelector.getInitialDungeonMinionCards(game);
    const remainingDungeonMinionCards = WeightSelector.getRemainingDungeonMinionCards(game);
    return remainingDungeonMinionCards / initialDungeonMinionCards;
  }

  private static getInitialDungeonMinionCards(game: Game):number {
    let total = 0;
    for (const field of game.dungeon.field) {
      total += field.initialBacklogSize;
    }
    return total;
  }

  private static getRemainingDungeonMinionCards(game: Game):number {
    let total = 0;
    for (const field of game.dungeon.field) {
      if (field.card) {
        total += 1;
      }
      total += field.backlog.length;
    }
    return total;
  }
}