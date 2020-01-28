import { MinionDraftCard } from '../entities/draft-card/minion-draft-card';
import { CardRarity } from '../enums/card-rarity';
import { AttackStatCraftingPart } from '../entities/crafting-part';
import { DraftCardModifier } from './draft-card-modifier';

describe('addCraftingPart', () => {
  test('@REGRESSION: actually updates draft card', () => {
    const draftCard = new MinionDraftCard(CardRarity.Common, 1, 2, 3);
    const craftingPart = new AttackStatCraftingPart(4);
    const result = DraftCardModifier.addCraftingPart(draftCard, craftingPart);
    expect(result.wasModified).toBeTruthy();
    expect(result.draftCard instanceof MinionDraftCard).toBeTruthy();
    if (!(result.draftCard instanceof MinionDraftCard)) {
      return;
    }
    expect(result.draftCard.attack).toBe(6);
    expect(result.draftCard.health).toBe(1);
    expect(result.draftCard.range).toBe(3);
  });

  test('does not mutate original draft card', () => {
    const draftCard = new MinionDraftCard(CardRarity.Common, 1, 2, 3);
    const craftingPart = new AttackStatCraftingPart(4);
    const result = DraftCardModifier.addCraftingPart(draftCard, craftingPart);
    expect(result.wasModified).toBeTruthy();
    expect(result.draftCard instanceof MinionDraftCard).toBeTruthy();
    if (!(result.draftCard instanceof MinionDraftCard)) {
      return;
    }
    expect(result.draftCard.attack).toBe(6);
    expect(draftCard.attack).toBe(2);
  });
});