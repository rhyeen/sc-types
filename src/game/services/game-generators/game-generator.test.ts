import { GameGenerator } from './game-generator';
import { CardType } from '../../../card/enums/card-type';
import { CardRarity } from '../../../card/enums/card-rarity';
import { CardAbilityHaste, CardAbilityEnergize } from '../../../card/entities/card-ability';
import { CardInterface } from '../../../card/card.interface';

function defaultSlot() {
  return {
    backlogPartitions: {
      common: { size: 7 },
      rare: { size: 5 },
      epic: { size: 3 },
      legendary: { size: 1 },
    },
    levelIncreaseChance: 0
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
  const cards = [
    getDungeonCardData(CardRarity.Common, 1, "CD_1", 1),
    getDungeonCardData(CardRarity.Common, 2, "CD_5", 5),
    getDungeonCardData(CardRarity.Common, 1, "CD_6", 6),
    getDungeonCardData(CardRarity.Epic, 4, "CD_2", 2),
    getDungeonCardData(CardRarity.Rare, 1, "CD_3", 3),
    getDungeonCardData(CardRarity.Legendary, 5, "CD_4", 4),
  ];
  const dungeonCards = {};
  for (const card of cards) {
    dungeonCards[card.hash] = card;
  }
  return dungeonCards;
}

function getDungeonCardData(rarity: CardRarity, level: number, forcedCardHash: string, hashBuster: number):CardInterface {
  return {
    name: 'Goblin',
    id: forcedCardHash,
    hash: forcedCardHash,
    type: CardType.Minion,
    rarity,
    attack: hashBuster,
    health: 1,
    range: 1,
    level,
    abilities: [new CardAbilityHaste()]
  }
}

function getPlayerCardData(rarity: CardRarity, forcedCardHash: string, hashBuster: number):CardInterface {
  return {
    name: 'Frontline Ravager',
    id: forcedCardHash,
    hash: forcedCardHash,
    type: CardType.Minion,
    rarity,
    attack: hashBuster,
    health: 1,
    range: 1,
    abilities: [new CardAbilityHaste()]
  }
}

function defaultPlayerCards() {
  return [
    getPlayerCardData(CardRarity.Standard, "CP_WS1", 1),
    getPlayerCardData(CardRarity.Standard, "CP_WS1", 1),
    {
      name: "Energize",
      id: "CP_EN1",
      type: CardType.Spell,
      rarity: CardRarity.Standard,
      abilities: [new CardAbilityEnergize(1)]
    },
    getPlayerCardData(CardRarity.Standard, "CP_WS1", 1),
    getPlayerCardData(CardRarity.Standard, "CP_WS1", 1),
  ]
}

function defaultIdentity() {
  return {
    id: "US_1",
    name: "rhyeen",
  }
}

test('init with no base cards', () => {
  const dungeonSeed = {
    dungeonCards: [],
    initial: defaultInitial(),
    field: [
      defaultSlot(),
      defaultSlot(),
      defaultSlot(),
    ]
  };
  const playerContext = {
    identity: defaultIdentity(),
    baseCards: []
  };
  const game = GameGenerator.generateFromSeed('GM_1', dungeonSeed, playerContext);
  expect(Object.keys(game.cardSets).length).toBe(0);
  expect(game.player.energy.current).toBe(10);
  expect(game.player.health.current).toBe(20);
  expect(game.player.hand.refillSize).toBe(5);
  expect(game.dungeon.field.length).toBe(3);
});

test('typical player base cards', () => {
  const dungeonSeed = {
    dungeonCards: [],
    initial: defaultInitial(),
    field: [
      defaultSlot(),
      defaultSlot(),
      defaultSlot(),
    ]
  };
  const playerContext = {
    identity: defaultIdentity(),
    baseCards: defaultPlayerCards()
  };
  const game = GameGenerator.generateFromSeed('GM_1', dungeonSeed, playerContext);
  expect(Object.keys(game.cardSets).length).toBe(2);
  expect(game.player.drawDeck.cards.length).toBe(1);
  expect(game.player.discardDeck.cards.length).toBe(4);
  expect(game.player.drawDeck.cards[0].name).toBe("Energize");
  expect(game.player.discardDeck.cards[0].name).toBe("Frontline Ravager");
  expect(game.player.discardDeck.cards[1].name).toBe("Frontline Ravager");
  expect(game.player.discardDeck.cards[2].name).toBe("Frontline Ravager");
  expect(game.player.discardDeck.cards[3].name).toBe("Frontline Ravager");
});

test('typical dungeon base cards', () => {
  const dungeonSeed = {
    dungeonCards: defaultDungeonCards(),
    initial: defaultInitial(),
    field: [
      defaultSlot(),
      defaultSlot(),
      defaultSlot(),
    ]
  };
  const playerContext = {
    identity: defaultIdentity(),
    baseCards: []
  };
  const game = GameGenerator.generateFromSeed('GM_1', dungeonSeed, playerContext);
  expect(Object.keys(game.cardSets).length).toBe(6);
  expect(game.dungeon.field[0].card.level).toBe(1);
  expect(game.dungeon.field[1].card.level).toBe(1);
  expect(game.dungeon.field[2].card.level).toBe(1);
  expect(game.dungeon.field[0].backlog.length).toBe(15);
  expect(game.dungeon.field[0].backlog[0].level).toBe(1);
  expect(game.dungeon.field[1].backlog[14].level).toBe(5);
  expect(game.dungeon.field[2].backlog[13].level).toBe(4);
});
