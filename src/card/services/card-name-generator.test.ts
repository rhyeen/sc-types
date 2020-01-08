import { CardType } from "../enums/card-type";
import { CardRarity } from "../enums/card-rarity";
import { CardAbilityHaste } from "../entities/card-ability";
import { CardInterface } from "../card.interface";
import { CardNameGenerator } from "./card-name-generator";

describe('getRandomCardNames', () => {
  test('ensure at least a couple cards return', () => {
    const card = <CardInterface>{
      type: CardType.Minion,
      rarity: CardRarity.Common,
      health: 1,
      attack: 2,
      range: 3,
      abilities: [ new CardAbilityHaste() ]
    };
    const names = CardNameGenerator.getRandomCardNames(card, 10);
    expect(names.size).toBeGreaterThan(1);
  });
});