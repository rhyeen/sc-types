import { MinionCard } from "./minion-card";
import { CardRarity } from "../../enums/card-rarity";
import { CardAbilityHaste, CardAbilitySpellshot } from "../card-ability";
import { EliteState } from "../elite-state";
import { StaticCardAbilityId, VariableCardAbilityId } from "../../enums/card-ability";

const defaultMinion = ():MinionCard => {
  return new MinionCard(CardRarity.Common, 1, 2, 3, [new CardAbilityHaste()], 4, 'test', 'CD_1');
};

const defaultEliteState = ():EliteState => {
  return new EliteState(1, 2, false, 0, [new CardAbilitySpellshot(1)], undefined, 1, 2, 3);
};

describe('incrementTurnOnField', () => {
  test('no eliteState should not throw error', () => {
    const minion = defaultMinion();
    minion.incrementTurnOnField();
    expect(minion.eliteState).toBe(undefined);
  });

  test('eliteState to increment to elite readiness', () => {
    const minion = defaultMinion();
    minion.eliteState = defaultEliteState();
    expect(minion.eliteState.turnCounter).toBe(0);
    minion.incrementTurnOnField();
    expect(minion.eliteState.turnCounter).toBe(1);
    expect(minion.eliteState.appliedEliteState).toBeFalsy();
    expect(minion.eliteState.readyForEliteState).toBeTruthy();
    expect(minion.eliteState.readyToExplode).toBeFalsy();
  });

  test('eliteState to increment to explosion', () => {
    const minion = defaultMinion();
    minion.eliteState = defaultEliteState();
    minion.incrementTurnOnField();
    minion.incrementTurnOnField();
    expect(minion.eliteState.readyToExplode).toBeFalsy();
    minion.incrementTurnOnField();
    expect(minion.eliteState.turnCounter).toBe(3);
    expect(minion.eliteState.readyToExplode).toBeTruthy();
  });
});

describe('attemptApplyEliteState', () => {
  test('no eliteState should not throw error', () => {
    const minion = defaultMinion();
    minion.attemptApplyEliteState();
    expect(minion.eliteState).toBe(undefined);
  });

  test('eliteState already applied', () => {
    const minion = defaultMinion();
    minion.eliteState = defaultEliteState();
    minion.eliteState.turnCounter = 42;
    minion.eliteState.appliedEliteState = true;
    minion.attemptApplyEliteState();
    expect(minion.health).toBe(1);
  });

  test('eliteState not ready', () => {
    const minion = defaultMinion();
    minion.eliteState = defaultEliteState();
    minion.attemptApplyEliteState();
    expect(minion.health).toBe(1);
  });

  test('eliteState applied', () => {
    const minion = defaultMinion();
    minion.eliteState = defaultEliteState();
    minion.eliteState.turnCounter = 42;
    minion.attemptApplyEliteState();
    expect(minion.health).toBe(2);
    expect(minion.attack).toBe(4);
    expect(minion.range).toBe(6);
    expect(minion.eliteState.appliedEliteState).toBeTruthy();
    expect(minion.abilities.length).toBe(2);
    expect(minion.abilities[0].id).toBe(StaticCardAbilityId.Haste);
    expect(minion.abilities[1].id).toBe(VariableCardAbilityId.Spellshot);
  });

  test('eliteState applied when minion has no abilities', () => {
    const minion = defaultMinion();
    minion.eliteState = defaultEliteState();
    minion.eliteState.turnCounter = 42;
    minion.abilities = [];
    minion.attemptApplyEliteState();
    expect(minion.health).toBe(2);
    expect(minion.attack).toBe(4);
    expect(minion.range).toBe(6);
    expect(minion.eliteState.appliedEliteState).toBeTruthy();
    expect(minion.abilities.length).toBe(1);
    expect(minion.abilities[0].id).toBe(VariableCardAbilityId.Spellshot);
  });
});
