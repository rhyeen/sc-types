import { Game } from "../../../../game/entities/game";
import { SpellOwnedCardAbility, CardAbilityTriggerEvent, CardAbilityTriggerEventArgs, CardAbilityPossibleTargets, CardAbilityTarget, CardAbilityTargetingType, CardAbilityTargetCardType } from "../card-ability";
import { AbilityId } from "./ability-id";
import { CardOwner } from "../../../enums/card-owner";
import { MinionCard } from "../../card/minion-card";

enum Variables {
  Amount = "amount"
}

export class CardAbilitySpellshot extends SpellOwnedCardAbility {
  constructor(isUsed: boolean, handIndex: number, amount: number) {
    const variables = {};
    variables[Variables.Amount] = amount;
    super(AbilityId.Spellshot, isUsed, handIndex, variables);
  }

  isTriggered(event: CardAbilityTriggerEvent, eventArgs?: CardAbilityTriggerEventArgs): boolean {
    const triggered = event === CardAbilityTriggerEvent.PlayThisFromHand;
    return this.checkAndDecreaseCooldown(triggered);
  }

  getTargetSelection(game: Game): CardAbilityPossibleTargets {
    const fieldSlotsWithMinions = this.opponentFieldHasMinion(game, CardOwner.Dungeon);
    const targets = fieldSlotsWithMinions.map(fieldSlot => {
      return {
        targetType: CardAbilityTargetCardType.OpponentFieldMinion,
        index: fieldSlot
      };
    });
    return {
      selectionType: CardAbilityTargetingType.Select,
      selectionAmount: 1,
      targets
    };
  }

  use(game: Game, targets: CardAbilityTarget[]): void {
    this.validateTargets(game, targets);
    for (const target of targets) {
      const card = game.dungeon.field[target.index].card;
      if (!(card instanceof MinionCard)) {
        throw new Error(`target is not a minion`);
      }
      card.handleDamage(this.variables[Variables.Amount]);
    }
    this.isUsed = true;
  }
}
