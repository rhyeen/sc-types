import { CardOrigin, CardArt } from "./card-origin";

test('@REGRESSION: json was returning undefined', () => {
  const cardOrigin = new CardOrigin();
  cardOrigin.id = 'MR111';
  cardOrigin.name = 'imp';
  cardOrigin.createdAt = new Date(2020,0,1,0,0,0);
  cardOrigin.updatedAt = new Date(2020,1,1,0,0,0);
  cardOrigin.original = {
    playerId: 'PL_1',
    gameId: 'GM_1',
  };
  cardOrigin.art = new CardArt();
  cardOrigin.art.credit = {
    creditedAt: new Date(2020,2,1,0,0,0),
    artistId: 'AR_1',
  };
  const cardOriginData = cardOrigin.json();
  expect(cardOriginData.id).toBe('MR111');
  expect(cardOriginData.name).toBe('imp');
  expect(cardOriginData.createdAt).toBe('2020-01-01T07:00:00.000Z');
  expect(cardOriginData.deletedAt).toBeFalsy();
  expect(cardOriginData.updatedAt).toBe('2020-02-01T07:00:00.000Z');
  expect(cardOriginData.original.playerId).toBe('PL_1');
  expect(cardOriginData.original.gameId).toBe('GM_1');
  expect(cardOriginData.art.credit.artistId).toBe('AR_1');
  expect(cardOriginData.art.credit.creditedAt).toBe('2020-03-01T07:00:00.000Z');
});

test('@REGRESSION: if art is not defined, return null for json', () => {
  const cardOrigin = new CardOrigin();
  const cardOriginData = cardOrigin.json();
  expect(cardOriginData.art).toBeFalsy();
});

test('@REGRESSION: art credit is undefined', () => {
  const cardOrigin = new CardOrigin();
  cardOrigin.art = new CardArt();
  const cardOriginData = cardOrigin.json();
  expect(cardOriginData.art).toBeTruthy();
  expect(cardOriginData.art.credit.artistId).toBeFalsy();
});