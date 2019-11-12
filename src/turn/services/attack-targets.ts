import { MinionCard } from '../../card/entities/card/minion-card';
import { FieldSlot } from '../../game/entities/field-slot';
import { Card } from '../../card/entities/card/card';

export class AttackTargets {
  static canAttackFieldSlotCard(selectedCard: MinionCard, selectedCardFieldIndex: number, targetCard: Card, targetCardFieldIndex: number):boolean {
    if (!targetCard || !(targetCard instanceof MinionCard)) {
      return false;
    }
    if (!AttackTargets.validPlayAreaIndex(selectedCardFieldIndex) || !AttackTargets.validPlayAreaIndex(targetCardFieldIndex)) {
      return false;
    }
    const distance = Math.abs(selectedCardFieldIndex - targetCardFieldIndex);
    return distance < selectedCard.range;
  }

  private static validPlayAreaIndex(fieldSlotIndex: number):boolean {
    return fieldSlotIndex >= 0;
  }

  static fieldSlotIndicesInAttackRange(selectedCard: MinionCard, selectedCardFieldIndex: number, targetFieldSlots: FieldSlot[]): number[] {
    const result = [];
    for (let i = 0; i < targetFieldSlots.length; i++) {
      if (AttackTargets.canAttackFieldSlotCard(selectedCard, selectedCardFieldIndex, targetFieldSlots[i].card, i)) {
        result.push(i);
      }
    }
    return result;
  }
}
