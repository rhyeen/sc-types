import { GameGenerator } from './game-generator';
import { CardType } from '../../../card/enums/card-type';
import { CardRarity } from '../../../card/enums/card-rarity';
import { CardAbilityHaste } from '../../../card/entities/card-ability';

function defaultField() {
  return {
    backlogPartitions: {
      common: { size: 7 },
      rare: { size: 5 },
      epic: { size: 3 },
      legendary: { size: 1 },
    }
  };
}

function defaultInitial() {
  return {
    player: {
      health: 20,
      energy: 10,
      handRefillSize: 5,
    }
  }
}

function defaultDungeonCards() {
  return [
    {
      name: 'Frontline Ravager',
      id: 'CD_RAVAGER',
      type: CardType.Minion,
      rarity: CardRarity.Common,
      attack: 1,
      health: 5,
      range: 1,
      abilities: [new CardAbilityHaste()]
    }
  ];
}

function defaultPlayerCards() {
  return [

  ]
}

test('init with no base cards', () => {
  const dungeonSeed = {
    dungeonCards: [],
    initial: defaultInitial(),
    field: [
      defaultField(),
      defaultField(),
      defaultField(),
    ]
  };
  const playerContext = {
    baseCards: []
  };
  const game = GameGenerator.generateFromSeed('GM_1', dungeonSeed, playerContext);
  expect(Object.keys(game.cardSets).length).toBe(0);
  expect(game.player.energy.current).toBe(10);
  expect(game.player.health.current).toBe(20);
  expect(game.player.hand.refillSize).toBe(5);
  expect(game.dungeon.field.length).toBe(3);
});


test('typical player base cards and dungeon base cards', () => {
  const dungeonSeed = {
    dungeonCards: defaultDungeonCards(),
    initial: defaultInitial(),
    field: [
      defaultField(),
      defaultField(),
      defaultField(),
    ]
  };
  const playerContext = {
    baseCards: defaultPlayerCards()
  };
  const game = GameGenerator.generateFromSeed('GM_1', dungeonSeed, playerContext);
  expect(Object.keys(game.cardSets).length).toBe(0);
  expect(game.player.energy.current).toBe(10);
  expect(game.player.health.current).toBe(20);
  expect(game.player.hand.refillSize).toBe(5);
  expect(game.dungeon.field.length).toBe(3);
});
