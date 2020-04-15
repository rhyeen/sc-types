import { Game } from "../../../../game/entities/game";
import { SpellOwnedCardAbility, CardAbilityTriggerEvent, CardAbilityTriggerEventArgs, CardAbilityPossibleTargets, CardAbilityTarget, CardAbilityTargetingType, CardAbilityPossibleTargetsSelectionAmountType, CardAbilityTargetCardType } from "../card-ability";
import { AbilityId } from "./ability-id";

enum Variables {
  Amount = "amount"
}

export class CardAbilityEnergize extends SpellOwnedCardAbility {
  constructor(isUsed: boolean, handIndex: number, amount: number) {
    const variables = {};
    variables[Variables.Amount] = amount;
    super(AbilityId.Energize, isUsed, handIndex, variables);
  }

  isTriggered(event: CardAbilityTriggerEvent, eventArgs?: CardAbilityTriggerEventArgs): boolean {
    const triggered = event === CardAbilityTriggerEvent.PlayThisFromHand;
    return this.checkAndDecreaseCooldown(triggered);
  }

  getTargetSelection(game: Game): CardAbilityPossibleTargets {
    return {
      selectionType: CardAbilityTargetingType.Select,
      selectionAmount: CardAbilityPossibleTargetsSelectionAmountType.All,
      targets: [
        {
          targetType: CardAbilityTargetCardType.Self
        }
      ]
    };
  }

  use(game: Game, targets: CardAbilityTarget[]): void {
    this.validateTargets(game, targets);
    game.player.energy.max += this.variables[Variables.Amount];
    game.player.energy.increase(this.variables[Variables.Amount]);
    this.isUsed = true;
  }
}
