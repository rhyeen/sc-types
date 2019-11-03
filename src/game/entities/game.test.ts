import { Game } from "./game";
import { Player } from "./player/player";
import { Dungeon } from "./dungeon";
import { DungeonFieldSlot } from "./field-slot";
import { CardSet } from "../../card/entities/card-set";
import { CardInterface } from "../../card/card.interface";
import { Card } from "../../card/entities/card/card";
import { CardType } from "../../card/enums/card-type";
import { CardRarity } from "../../card/enums/card-rarity";

function defaultPlayer(cardSets: Record<string,CardSet>):Player {
  return new Player(20, 10, 5);
}

function defaultDungeon(cardSets: Record<string,CardSet>):Dungeon {
  const field = [
    new DungeonFieldSlot(
      cardSets['HS_1'].instances['HS_1_0'], 
      [
        cardSets['HS_1'].instances['HS_1_1'],
        cardSets['HS_1'].instances['HS_2_2'],
      ]),
      new DungeonFieldSlot(
        cardSets['HS_1'].instances['HS_1_3'], 
        [
          cardSets['HS_1'].instances['HS_1_4'],
        ]),
    new DungeonFieldSlot()
  ];
  return new Dungeon(field);
}

function defaultCardSets():Record<string, CardSet> {
  const cardSets = {};
  let cardSet = getCardSet({
    name: 'goblin',
    id: 'CD_1',
    type: CardType.Minion,
    rarity: CardRarity.Common,
    hash: 'HS_1'
  }, 5);
  cardSets[cardSet.baseCard.hash] = cardSet;
  return cardSets;
}

function getCardSet(baseCard: CardInterface, numberOfIntances: number):CardSet {
  const cardSet = new CardSet(baseCard);
  for (let i = 0; i < numberOfIntances; i++) {
    cardSet.setInstance(getCard(baseCard, i));
  }
  return cardSet
}

function getCard(cardInterface: CardInterface, instanceId: number):Card {
  return new Card(cardInterface.rarity, cardInterface.type, cardInterface.abilities, cardInterface.cost, cardInterface.name, `${cardInterface.id}_${instanceId}`, cardInterface.hash);
}

test('init', () => {
  const cardSets = defaultCardSets();
  const game = new Game(defaultPlayer(cardSets), defaultDungeon(cardSets), cardSets);
  expect(game.cardSets).toBe(cardSets);
  expect(game.dungeon.field[0].backlog[1]).toBe(cardSets['HS_1'].instances['HS_2_2']);
});
