import { CardHasher } from "./card-hasher";
import { CardType } from "../enums/card-type";
import { CardRarity } from "../enums/card-rarity";
import { CardAbilitySpellshot } from "../entities/card-ability";
import { StaticCardAbilityId, VariableCardAbilityId } from "../enums/card-ability";

describe('getCard', () => {
  test('ensure minion card is created correctly', () => {
    const card = CardHasher.getCard("MC123|A;HS;SSA");
    expect(card.type).toBe(CardType.Minion);
    expect(card.rarity).toBe(CardRarity.Common);
    expect(card.health).toBe(1);
    expect(card.attack).toBe(2);
    expect(card.range).toBe(3);
    expect(card.abilities.length).toBe(2);
    expect(card.abilities[0].id).toBe(StaticCardAbilityId.Haste);
    const abilityB = card.abilities[1];
    expect(abilityB.id).toBe(VariableCardAbilityId.Spellshot);
    expect(abilityB instanceof CardAbilitySpellshot);
    if (!(abilityB instanceof CardAbilitySpellshot)) {
      return;
    }
    expect(abilityB.amount).toBe(10);
  });

  test('ensure spell card is created correctly', () => {
    const card = CardHasher.getCard("SL000|A;SSb");
    expect(card.type).toBe(CardType.Spell);
    expect(card.rarity).toBe(CardRarity.Legendary);
    expect(card.health).toBeFalsy();
    expect(card.attack).toBeFalsy();
    expect(card.range).toBeFalsy();
    expect(card.abilities.length).toBe(1);
    const abilityA = card.abilities[0];
    expect(abilityA.id).toBe(VariableCardAbilityId.Spellshot);
    expect(abilityA instanceof CardAbilitySpellshot);
    if (!(abilityA instanceof CardAbilitySpellshot)) {
      return;
    }
    expect(abilityA.amount).toBe(-2);
  });
});