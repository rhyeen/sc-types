import { GameBuilder } from './game-builder';

test('actual game data from backend', () => {
  const gameData = {"id":"4TosRfqL9XALIg1ykvJr","player":{"health":20,"energy":10,"field":[{"card":null},{"card":null},{"card":null}],"hand":{"cards":[]},"drawDeck":{"size":1},"discardDeck":{"cards":[{"id":"CP_WS1","hash":"MS312"},{"id":"CP_WS1","hash":"MS312"},{"id":"CP_WS1","hash":"MS312"},{"id":"CP_WS1","hash":"MS312"},{"id":"CP_WS1","hash":"MS312"},{"id":"CP_WS1","hash":"MS312"},{"id":"CP_WS1","hash":"MS312"},{"id":"CP_WS1","hash":"MS312"},{"id":"CP_WS1","hash":"MS312"}]},"lostDeck":{"cards":[]}},"dungeon":{"field":[{"card":null,"backlog":{"size":0}},{"card":null,"backlog":{"size":0}},{"card":null,"backlog":{"size":0}}]},"cardSets":{"SS000|A;EN1":{"baseCard":{"type":"spell","rarity":"standard","abilities":[{"id":"energize","tier":"abilityTierGodly","amount":1}],"name":"Energize","_id":"CP_EN1","conditions":{},"_hash":"SS000|A;EN1"},"instances":[{"id":"CP_EN1"}]},"MS312":{"baseCard":{"type":"minion","rarity":"standard","abilities":[],"name":"Common Wisp","_id":"CP_WS1","conditions":{},"health":3,"attack":1,"range":2,"_hash":"MS312"},"instances":[{"id":"CP_WS1"}]}}};
  const game = GameBuilder.buildGame(gameData);
  console.log('@TODO');
  console.log(game);
  // expect(game.json(true, true)).toEqual(gameData);
});
