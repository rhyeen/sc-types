import { MinionCard } from '../../card/entities/card/minion-card';
import { ActionTarget } from '../entities/action-target';
import { Game } from '../../game/entities/game';

export class AbilityTargets {
  static getDungeonMinionAbilityTargets(selectedCard: MinionCard, selectedCardFieldIndex: number, game: Game):ActionTarget[] {
    return [];
  }
}
