import { CraftingTable } from './crafting-table';
import { CardRarity } from '../../../card/enums/card-rarity';

describe('getMaxNumberOfDraftedInstances', () => {
  test('check default', () => {
    const craftingTable = new CraftingTable();
    expect(craftingTable.getMaxNumberOfDraftedInstances(CardRarity.Common)).toEqual(5);
    expect(craftingTable.getMaxNumberOfDraftedInstances(CardRarity.Rare)).toEqual(3);
    expect(craftingTable.getMaxNumberOfDraftedInstances(CardRarity.Epic)).toEqual(2);
    expect(craftingTable.getMaxNumberOfDraftedInstances(CardRarity.Legendary)).toEqual(1);
  });
});
