import { Card } from './card';
import { CardRarity } from '../../enums/card-rarity';
import { StaticCardAbilityId } from '../../enums/card-ability';
import { CardType } from '../../enums/card-type';
import { StaticCardAbility } from '../card-ability';

test('init', () => {
  const card = new Card(CardRarity.Common, CardType.Spell);
  expect(card.rarity).toBe(CardRarity.Common);
});

test('hasAbility after init', () => {
  const card = new Card(CardRarity.Common, CardType.Minion);
  expect(card.hasAbility(StaticCardAbilityId.Haste)).toBe(false);
});

test('hasAbility after adding ability', () => {
  const card = new Card(CardRarity.Common, CardType.Minion);
  card.abilities.push(new StaticCardAbility(StaticCardAbilityId.Haste));
  expect(card.hasAbility(StaticCardAbilityId.Haste)).toBe(true);
});

test('getAbility after init', () => {
  const t = () => {
    const card = new Card(CardRarity.Common, CardType.Minion);
    card.getAbility(StaticCardAbilityId.Haste)
  };
  expect(t).toThrow(Error);
});

test('getAbility after adding ability', () => {
  const card = new Card(CardRarity.Common, CardType.Minion);
  card.abilities.push(new StaticCardAbility(StaticCardAbilityId.Haste));
  expect(card.getAbility(StaticCardAbilityId.Haste).id).toBe(StaticCardAbilityId.Haste);
});
