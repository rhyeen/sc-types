import { TurnAction } from "../../entities/turn-action/turn-action";
import { PlaceMinionAction } from "../../entities/turn-action/player-turn-actions/place-minion-action";
import { ActionType, ActionTargetType } from "../../enums/action-type";
import { PlayMinionAttackAction } from "../../entities/turn-action/player-turn-actions/play-minion-attack-action";
import { ActionTarget, DungeonActionTarget, DungeonMinionActionTarget, PlayerActionTarget, PlayerMinionActionTarget } from "../../entities/action-target";
import { PlayMinionAbilityAction } from "../../entities/turn-action/player-turn-actions/play-minion-ability-action";
import { PlaySpellAbilityAction } from "../../entities/turn-action/player-turn-actions/play-spell-ability-action";
import { CraftBaseCardAction } from "../../entities/turn-action/player-turn-actions/craft-base-card-action";
import { AddCraftingPartAction } from "../../entities/turn-action/player-turn-actions/add-crafting-part-action";
import { AddCraftedCardToDeckAction } from "../../entities/turn-action/player-turn-actions/add-crafted-card-to-deck-action";
import { CardOrigin } from "../../../card/entities/card-origin/card-origin";
import { CardOriginBuilder } from "../../../card/services/builders/card-origin-builder";

export class TurnActionBuilder {
    static buildTurnActions(turnActionsData: any[]):TurnAction[] {
        const turnActions = [];
        for (const turnActionData of turnActionsData) {
            turnActions.push(TurnActionBuilder.buildTurnAction(turnActionData));
        }
        return turnActions;
    }

    static buildTurnAction(turnActionData: any):TurnAction {
        const targets = TurnActionBuilder.buildActionTargets(turnActionData.targets);
        const cardOrigin = TurnActionBuilder.buildCardOrigin(turnActionData.cardOrigin);
        switch (turnActionData.type) {
            case ActionType.PlaceMinion:
                return new PlaceMinionAction(turnActionData.source.handIndex, turnActionData.target.fieldIndex);
            case ActionType.PlayMinionAttack:
                return new PlayMinionAttackAction(turnActionData.source.fieldIndex, targets);
            case ActionType.PlayMinionAbility:
                return new PlayMinionAbilityAction(turnActionData.source.fieldIndex, targets);
            case ActionType.PlaySpellAbility:
                return new PlaySpellAbilityAction(turnActionData.source.handIndex, targets);
            case ActionType.CraftBaseCard:
                return new CraftBaseCardAction(turnActionData.baseCardIndex, turnActionData.forgeSlotIndex);
            case ActionType.AddCraftingPart:
                return new AddCraftingPartAction(turnActionData.craftingPartIndex, turnActionData.forgeSlotIndex);
            case ActionType.AddCraftedCardToDeck:
                return new AddCraftedCardToDeckAction(turnActionData.forgeSlotIndex, turnActionData.numberOfInstances, cardOrigin);
            default:
                throw new Error(`unexpected turn action type: ${turnActionData.type}`);
        }
    }

    private static buildActionTargets(actionTargetsData: any[]):ActionTarget[] {
        if (!actionTargetsData) {
            return null;
        }
        const actionTargets = [];
        for (const actionTargetData of actionTargetsData) {
            actionTargets.push(TurnActionBuilder.buildActionTarget(actionTargetData));
        }
        return actionTargets;
    }

    private static buildActionTarget(actionTargetData: any):ActionTarget {
        switch (actionTargetData.type) {
            case ActionTargetType.TargetOponnet:
                return new DungeonActionTarget();
            case ActionTargetType.TargetDungeonMinion:
                return new DungeonMinionActionTarget(actionTargetData.fieldIndex);
            case ActionTargetType.TargetPlayer:
                return new PlayerActionTarget();
            case ActionTargetType.TargetPlayerMinion:
                return new PlayerMinionActionTarget(actionTargetData.fieldIndex);
            default:
                throw new Error(`unexpected action target type: ${actionTargetData.type}`);
        }
    }

    private static buildCardOrigin(cardOriginData: any):CardOrigin {
        if (!cardOriginData) {
            return null;
        }
        return CardOriginBuilder.buildCardOrigin(cardOriginData);
    }
}