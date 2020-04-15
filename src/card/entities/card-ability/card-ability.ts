import { Game } from "../../../game/entities/game";
import { CardOwner } from "../../enums/card-owner";
import { CardAbilityStub } from "./card-ability-stub";
import { FieldSlot } from "../../../game/entities/field-slot";
import { MinionCard } from "../card/minion-card";

export class CardAbility extends CardAbilityStub {
  isTriggered(event: CardAbilityTriggerEvent, eventArgs?: CardAbilityTriggerEventArgs): boolean {
    throw new Error('not implemented');
  }

  getTargetSelection(game: Game): CardAbilityPossibleTargets {
    throw new Error('not implemented');
  }

  use(game: Game, targets: CardAbilityTarget[]): void {
    throw new Error('not implemented');
  }

  protected validateTargets(game: Game, targets: CardAbilityTarget[]): void {
    const possibleTargets = this.getTargetSelection(game);
    if (targets.length !== Math.min(possibleTargets.selectionAmount, possibleTargets.targets.length)) {
      throw new Error(`expected number of targets: ${Math.min(possibleTargets.selectionAmount, possibleTargets.targets.length)}, actual: ${targets.length}`);
    }
    for (const target of targets) {
      let foundMatch = false;
      for (let i = 0; i < possibleTargets.targets.length; i++) {
        const possibleTarget = possibleTargets.targets[i];
        if (possibleTarget.index === target.index && possibleTarget.targetType === target.targetType) {
          foundMatch = true;
          possibleTargets.targets.splice(i, 1);
        }
      }
      if (!foundMatch) {
        throw new Error(`could not find target type: ${target.targetType} at: ${target.index} in the list of possible targets`);
      }
    }
  }

  getRandomTargets(possibleTargets: CardAbilityPossibleTargets): CardAbilityTarget[] {
    if (possibleTargets.selectionType !== CardAbilityTargetingType.Random) {
      throw new Error(`selectionType must be ${CardAbilityTargetingType.Random}`);
    }
    if (possibleTargets.selectionAmount >= possibleTargets.targets.length) {
      return possibleTargets.targets;
    }
    const targetArr = [...possibleTargets.targets];
    const selectedTargets = [];
    for (let i = 0; i < possibleTargets.selectionAmount; i++) {
      selectedTargets.push(this.removeRandomItemFromArray(targetArr));
    }
    return selectedTargets;
  }

  private removeRandomItemFromArray(items: any[]): any {
    const index = Math.floor(Math.random() * items.length);
    return items.splice(index, 1)[0];
  }

  protected opponentFieldHasMinion(game: Game, owner: CardOwner): number[] {
    if (owner === CardOwner.Player) {
      return this.getFieldSlotsWithMinionCard(game.dungeon.field);
    } else {
      return this.getFieldSlotsWithMinionCard(game.player.field);
    }
  }

  private getFieldSlotsWithMinionCard(field: FieldSlot[]): number[] {
    let fieldSlotsWithMinion = [];
    for (let i = 0; i < field.length; i++) {
      if (field[i].card && field[i].card instanceof MinionCard) {
        fieldSlotsWithMinion.push(i);
      }
    }
    return fieldSlotsWithMinion;
  }

  protected selfFieldHasMinion(game: Game, owner: CardOwner): number[] {
    if (owner === CardOwner.Dungeon) {
      return this.getFieldSlotsWithMinionCard(game.dungeon.field);
    } else {
      return this.getFieldSlotsWithMinionCard(game.player.field);
    }
  }
}

export class MinionOwnedCardAbility extends CardAbility {
  owner: CardOwner;
  fieldSlotIndex: number;

  constructor(id: string, isUsed: boolean, owner: CardOwner, fieldSlotIndex: number, variables?: Record<string, number>, currentCooldown?: number, maxCooldown?: number) {
    super(id, isUsed, variables, currentCooldown, maxCooldown);
    this.owner = owner;
    this.fieldSlotIndex = fieldSlotIndex;
  }
}

export class SpellOwnedCardAbility extends CardAbility {
  handIndex: number;

  constructor(id: string, isUsed: boolean, handIndex: number, variables?: Record<string, number>, currentCooldown?: number, maxCooldown?: number) {
    super(id, isUsed, variables, currentCooldown, maxCooldown);
    this.handIndex = handIndex;
  }
}

export interface CardAbilityTriggerEventArgs {
  amount?: number;
}


export enum CardAbilityTriggerEvent {
  PlaceThisOnField = "placeThisOnField",
  PlayThisFromHand = "playThisFromHand",
}

export interface CardAbilityPossibleTargets {
  selectionType: CardAbilityTargetingType;
  selectionAmount: number | CardAbilityPossibleTargetsSelectionAmountType;
  targets: CardAbilityTarget[];
}

export enum CardAbilityPossibleTargetsSelectionAmountType {
  All = 99,
}

export enum CardAbilityTargetingType {
  Random = "random",
  Select = "select",
}

export interface CardAbilityTarget {
  index?: number;
  targetType: CardAbilityTargetCardType;
}

export enum CardAbilityTargetCardType {
  SelfFieldMinion = "selfFieldMinion",
  SelfHandCard = "selfHandCard",
  Self = "self",
  OpponentFieldMinion = "opponentFieldMinion",
  OpponentHandCard = "opponentHandCard",
  Opponent = "opponent",
}