import { CardType } from "../enums/card-type";
import { CardRarity } from "../enums/card-rarity";
import { CardAbilityHaste } from "../entities/card-ability";
import { CardInterface } from "../card.interface";
import { CardNameGenerator, CardName } from "./card-name-generator";

describe('isValidName', () => {
  test('valid id and name for given card', () => {
    const card = <CardInterface>{
      type: CardType.Minion,
      rarity: CardRarity.Common,
      health: 1,
      attack: 2,
      range: 3,
      abilities: [ new CardAbilityHaste() ]
    };
    const name = new CardName('1:0|1|3', 'Herald of Little Fortune');
    expect(CardNameGenerator.isValidName(card, name)).toBeTruthy();
  });

  test('not a valid name for the card rarity', () => {
    const card = <CardInterface>{
      type: CardType.Minion,
      rarity: CardRarity.Epic,
      health: 1,
      attack: 2,
      range: 3,
      abilities: [ new CardAbilityHaste() ]
    };
    const name = new CardName('1:0|1|3', 'Herald of Little Fortune');
    expect(CardNameGenerator.isValidName(card, name)).toBeFalsy();
  });

  test('not a valid id', () => {
    const card = <CardInterface>{
      type: CardType.Minion,
      rarity: CardRarity.Common,
      health: 1,
      attack: 2,
      range: 3,
      abilities: [ new CardAbilityHaste() ]
    };
    const name = new CardName('hello world', 'Herald of Little Fortune');
    expect(CardNameGenerator.isValidName(card, name)).toBeFalsy();
  });

  test('not a valid name', () => {
    const card = <CardInterface>{
      type: CardType.Minion,
      rarity: CardRarity.Common,
      health: 1,
      attack: 2,
      range: 3,
      abilities: [ new CardAbilityHaste() ]
    };
    const name = new CardName('1:0|1|3', '');
    expect(CardNameGenerator.isValidName(card, name)).toBeFalsy();
  });
});

describe('getRandomCardNames', () => {
  test('ensure at least a couple cards return with correct ids', () => {
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
    for (const name of names) {
      expect(CardNameGenerator.isValidName(card, name)).toBeTruthy();
    }
  });
});