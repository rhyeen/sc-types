import { Game } from "../../../../game/entities/game";
import { MinionOwnedCardAbility, CardAbilityTriggerEvent, CardAbilityTriggerEventArgs, CardAbilityPossibleTargets, CardAbilityTarget, CardAbilityTargetingType, CardAbilityPossibleTargetsSelectionAmountType, CardAbilityTargetCardType } from "../card-ability";
import { AbilityId } from "./ability-id";
import { CardOwner } from "../../../enums/card-owner";
import { MinionCard } from "../../card/minion-card";
import { Card } from "../../card/card";

export class CardAbilityHaste extends MinionOwnedCardAbility {
  constructor(isUsed: boolean, owner: CardOwner, fieldSlotIndex: number) {
    super(AbilityId.Haste, isUsed, owner, fieldSlotIndex);
  }

  isTriggered(event: CardAbilityTriggerEvent, eventArgs?: CardAbilityTriggerEventArgs): boolean {
    const triggered = event === CardAbilityTriggerEvent.PlaceThisOnField;
    return this.checkAndDecreaseCooldown(triggered);
  }

  getTargetSelection(game: Game): CardAbilityPossibleTargets {
    return {
      selectionType: CardAbilityTargetingType.Select,
      selectionAmount: CardAbilityPossibleTargetsSelectionAmountType.All,
      targets: [
        {
          targetType: CardAbilityTargetCardType.SelfFieldMinion,
          index: this.fieldSlotIndex,
        }
      ]
    };
  }

  use(game: Game, targets: CardAbilityTarget[]): void {
    this.validateTargets(game, targets);
    let card: Card;
    if (this.owner === CardOwner.Player) {
      card = game.player.field[this.fieldSlotIndex].card;
    } else {
      card = game.dungeon.field[this.fieldSlotIndex].card;
    }
    if (!card || !(card instanceof MinionCard)) {
      throw new Error(`card does not exist at field slot: ${this.fieldSlotIndex}`);
    }
    card.conditions.exhausted = false;
    this.isUsed = true;
  }
}
