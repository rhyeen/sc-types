import { TurnActionBuilder } from './turn-action-builder';
import { PlaceMinionAction } from '../../entities/turn-action/player-turn-actions/place-minion-action';
import { PlayMinionAttackAction } from '../../entities/turn-action/player-turn-actions/play-minion-attack-action';
import { DungeonMinionActionTarget } from '../../entities/action-target';

describe('buildTurnActions', () => {
  test('build place minion and attack with minion action', () => {
    const turnActions = [
      {"type":"placeMinion","source":{"handIndex":1},"target":{"fieldIndex":1}},
      {"type":"playMinionAttack","source":{"fieldIndex":1},"targets":[{"type":"targetDungeonMinion","fieldIndex":1}]}
    ];
    const result = TurnActionBuilder.buildTurnActions(turnActions);
    expect(result.length).toBe(2);
    const resultA = result[0];
    const resultB = result[1];
    expect(resultA instanceof PlaceMinionAction).toBeTruthy();
    expect(resultB instanceof PlayMinionAttackAction).toBeTruthy();
    if (!(resultA instanceof PlaceMinionAction) || !(resultB instanceof PlayMinionAttackAction)) {
      return;
    }
    expect(resultA.playerSourceHandIndex).toBe(1);
    expect(resultA.playerTargetFieldIndex).toBe(1);
    expect(resultB.playerSourceFieldIndex).toBe(1);
    expect(resultB.targets.length).toBe(1);
    const resultBtargetA = resultB.targets[0];
    expect(resultBtargetA instanceof DungeonMinionActionTarget).toBeTruthy();
    if (!(resultBtargetA instanceof DungeonMinionActionTarget)) {
      return;
    }
    expect(resultBtargetA.targetDungeonFieldIndex).toBe(1);
  });
});