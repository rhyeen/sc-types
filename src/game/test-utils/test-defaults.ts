import { Game } from "../entities/game";
import { Player } from "../entities/player/player";
import { Dungeon } from "../entities/dungeon";
import { DungeonFieldSlot } from "../entities/field-slot";
import { CardSet } from "../../card/entities/card-set";
import { CardInterface } from "../../card/card.interface";
import { Card } from "../../card/entities/card/card";
import { CardType } from "../../card/enums/card-type";
import { CardRarity } from "../../card/enums/card-rarity";
import { CardBuilder } from "../../card/services/card-builder";

export function defaultGame():Game {
  const cardSets = defaultCardSets();
  return new Game('GM_1', defaultPlayer(cardSets), defaultDungeon(cardSets), cardSets);
}

export function defaultPlayer(cardSets: Record<string,CardSet>):Player {
  const player = new Player("US_1", "rhyeen", 20, 10, 5);
  player.hand.add(cardSets['HS_2'].instances['CD_2_0']);
  player.hand.add(cardSets['HS_2'].instances['CD_2_1']);
  player.hand.add(cardSets['HS_2'].instances['CD_2_2']);
  return player;
}

export function defaultDungeon(cardSets: Record<string,CardSet>):Dungeon { 
  const field = [
    new DungeonFieldSlot(
      cardSets['HS_1'].instances['CD_1_0'], 
      [
        cardSets['HS_1'].instances['CD_1_1'],
        cardSets['HS_1'].instances['CD_1_2'],
      ]),
      new DungeonFieldSlot(
        cardSets['HS_1'].instances['CD_1_3'], 
        [
          cardSets['HS_1'].instances['CD_1_4'],
        ]),
    new DungeonFieldSlot()
  ];
  return new Dungeon(field);
}

export function defaultCardSets():Record<string, CardSet> {
  const cardSets = {};
  let cardSet = getCardSet({
    name: 'goblin',
    id: 'CD_1',
    type: CardType.Minion,
    rarity: CardRarity.Common,
    hash: 'HS_1',
    attack: 2,
    health: 5,
    range: 1
  }, 5);
  cardSets[cardSet.baseCard.hash] = cardSet;
  cardSet = getCardSet({
    name: 'ranger',
    id: 'CD_2',
    type: CardType.Minion,
    rarity: CardRarity.Rare,
    hash: 'HS_2',
    attack: 1,
    health: 2,
    range: 3,
    cost: 3
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
  return CardBuilder.getTypedCard(cardInterface, `${cardInterface.id}_${instanceId}`);
}
