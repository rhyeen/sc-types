import { TurnAction } from "../turn-action";
import { ActionType } from "../../../enums/action-type";
import { Game } from "../../../../game/entities/game";
import { MinionCard } from "../../../../card/entities/card/minion-card";
import { Card } from "../../../../card/entities/card/card";
import { PlayerFieldSlot } from "../../../../game/entities/field-slot";
import { TurnActionResult } from "../turn-action-result";
import { GameChange } from "../../../enums/game-change";

export class PlaceMinionAction extends TurnAction {
  playerSourceHandIndex: number;
  playerTargetFieldIndex: number;

  constructor(playerSourceHandIndex: number, playerTargetFieldIndex: number) {
    super(ActionType.PlaceMinion);
    this.playerSourceHandIndex = playerSourceHandIndex;
    this.playerTargetFieldIndex = playerTargetFieldIndex;
  }

  json():any {
    return {
      type: this.type,
      source: {
        handIndex: this.playerSourceHandIndex
      },
      target: {
        fieldIndex: this.playerTargetFieldIndex
      }
    };
  }

  execute(game: Game):TurnActionResult {
    this.validate(game);
    const result = new TurnActionResult(game);
    this.payCardCost(result);
    const shield = this.clearFieldSlot(result);
    this.prepareCardForField(result, shield);
    this.placeCardOnField(result);
    return result;
  }

  validate(game: Game) {
    if (game.player.field.length <= this.playerTargetFieldIndex) {
      throw new Error(`invalid player field index: ${this.playerTargetFieldIndex} with player field of size: ${game.player.field.length}`);
    }
    if (game.player.hand.cards.length <= this.playerSourceHandIndex) {
      throw new Error(`invalid player hand index: ${this.playerSourceHandIndex} with player hand of size: ${game.player.hand.cards.length}`);
    }
    const playerSourceHandCard = this.getPlayerSourceHandCard(game);
    if (!(playerSourceHandCard instanceof MinionCard)) {
      throw new Error(`player hand card: ${playerSourceHandCard} is not a card that can be placed on the field`);
    }
    if (game.player.energy.current < playerSourceHandCard.cost) {
      throw new Error(`player hand card's cost: ${playerSourceHandCard.cost} is greater than player's current energy: ${game.player.energy.current}`);
    }
  }

  private getPlayerSourceHandCard(game: Game):Card {
    return game.player.hand.cards[this.playerSourceHandIndex];
  }

  private getPlayerTargetFieldSlot(game: Game):PlayerFieldSlot {
    return game.player.field[this.playerTargetFieldIndex];
  }

  private payCardCost(result: TurnActionResult) {
    const playerSourceHandCard = this.getPlayerSourceHandCard(result.game);
    result.game.player.energy.decrease(playerSourceHandCard.cost);
    result.recordGameChange(GameChange.PlayerEnergy);
  }

  private clearFieldSlot(result: TurnActionResult):number {
    const playerTargetFieldSlot = this.getPlayerTargetFieldSlot(result.game);
    if (!playerTargetFieldSlot.card) {
      return 0;
    }
    const card = playerTargetFieldSlot.card;
    result.game.player.discardDeck.add(card);
    result.recordGameChange(GameChange.PlayerDiscardDeck);
    result.recordCardChange(card);
    playerTargetFieldSlot.clear();
    result.recordGameChange(GameChange.PlayerField);
    if (!(card instanceof MinionCard)) {
      return 0;
    }
    return card.remainingHealth + card.conditions.shield;
  }

  private prepareCardForField(result: TurnActionResult, shield: number) {
    const playerSourceHandCard = this.getPlayerSourceHandCard(result.game);
    // @NOTE: even though technically only minions have shield, 
    // there's no reason to check for MinionCard type on the card as it's just a standard conditon.
    playerSourceHandCard.conditions.shield += shield;
    if (!(playerSourceHandCard instanceof MinionCard) || !playerSourceHandCard.hasHaste()) {
      playerSourceHandCard.conditions.exhausted = true;
    }
    result.recordCardChange(playerSourceHandCard);
  }

  private placeCardOnField(result: TurnActionResult) {
    const playerSourceHandCard = this.getPlayerSourceHandCard(result.game);
    const playerTargetFieldSlot = this.getPlayerTargetFieldSlot(result.game);
    playerTargetFieldSlot.fill(playerSourceHandCard);
    result.recordGameChange(GameChange.PlayerField);
    result.game.player.hand.remove(this.playerSourceHandIndex);
    result.recordGameChange(GameChange.PlayerHand);
  }
}
