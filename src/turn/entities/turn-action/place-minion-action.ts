import { TurnAction } from "./turn-action";
import { ActionType } from "../../enums/action-type";
import { Game } from "../../../game/entities/game";
import { MinionCard } from "../../../card/entities/card/minion-card";
import { Card } from "../../../card/entities/card/card";
import { PlayerFieldSlot } from "../../../game/entities/field-slot";
import { TurnActionResult } from "./turn-action-result";
import { GameChange } from "../../enums/game-change";

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
    this._payCardCost(result);
    const shield = this._clearFieldSlot(result);
    this._prepareCardForField(result, shield);
    this._placeCardOnField(result);
    return result;
  }

  validate(game: Game) {
    if (game.player.field.length <= this.playerTargetFieldIndex) {
      throw new Error(`invalid player field index: ${this.playerTargetFieldIndex} with player field of size: ${game.player.field.length}`);
    }
    if (game.player.hand.cards.length <= this.playerSourceHandIndex) {
      throw new Error(`invalid player hand index: ${this.playerSourceHandIndex} with player hand of size: ${game.player.hand.cards.length}`);
    }
    const playerSourceHandCard = this._getPlayerSourceHandCard(game);
    if (!(playerSourceHandCard instanceof MinionCard)) {
      console.log(playerSourceHandCard);
      throw new Error(`player hand card: ${playerSourceHandCard} is not a card that can be placed on the field`);
    }
    if (game.player.energy.current < playerSourceHandCard.cost) {
      throw new Error(`player hand card's cost: ${playerSourceHandCard.cost} is greater than player's current energy: ${game.player.energy.current}`);
    }
  }

  _getPlayerSourceHandCard(game: Game):Card {
    return game.player.hand.cards[this.playerSourceHandIndex];
  }

  _getPlayerTargetFieldSlot(game: Game):PlayerFieldSlot {
    return game.player.field[this.playerTargetFieldIndex];
  }

  _payCardCost(result: TurnActionResult) {
    const playerSourceHandCard = this._getPlayerSourceHandCard(result.game);
    result.game.player.energy.decrease(playerSourceHandCard.cost);
    result.recordGameChange(GameChange.PlayerEnergy);
  }

  _clearFieldSlot(result: TurnActionResult):number {
    const playerTargetFieldSlot = this._getPlayerTargetFieldSlot(result.game);
    if (!playerTargetFieldSlot.card) {
      return 0;
    }
    result.game.player.discardDeck.add(playerTargetFieldSlot.card);
    result.recordGameChange(GameChange.PlayerDiscardDeck);
    playerTargetFieldSlot.card.clearConditions();
    result.recordCardChange(playerTargetFieldSlot.card);
    playerTargetFieldSlot.clear();
    result.recordGameChange(GameChange.PlayerField);
    if (!(playerTargetFieldSlot.card instanceof MinionCard)) {
      return 0;
    }
    return playerTargetFieldSlot.card.health + playerTargetFieldSlot.card.conditions.shield;
  }

  _prepareCardForField(result: TurnActionResult, shield: number) {
    const playerSourceHandCard = this._getPlayerSourceHandCard(result.game);
    // @NOTE: even though technically only minions have shield, there's no reason that is required as it's just a standard conditon.
    playerSourceHandCard.conditions.shield += shield;
    if (!(playerSourceHandCard instanceof MinionCard) || !playerSourceHandCard.hasHaste()) {
      playerSourceHandCard.conditions.exhausted = true;
    }
    result.recordCardChange(playerSourceHandCard);
  }

  _placeCardOnField(result: TurnActionResult) {
    const playerSourceHandCard = this._getPlayerSourceHandCard(result.game);
    const playerTargetFieldSlot = this._getPlayerTargetFieldSlot(result.game);
    playerTargetFieldSlot.fill(playerSourceHandCard);
    result.recordGameChange(GameChange.PlayerField);
    result.game.player.hand.remove(this.playerSourceHandIndex);
    result.recordGameChange(GameChange.PlayerHand);
  }
}
