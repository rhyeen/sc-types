import { TurnAction } from "../turn-action";
import { ActionType } from "../../../enums/action-type";
import { Game } from "../../../../game/entities/game";
import { TurnActionResult } from "../turn-action-result";
import { GamePhase } from "../../../../game/enums/game-phase";
import { CardOrigin } from "../../../../card/entities/card-origin/card-origin";
import { CardSet } from "../../../../card/entities/card-set";
import { GameChange } from "../../../enums/game-change";

export class AddCraftedCardToDeckAction extends TurnAction {
  forgeSlotIndex: number;
  numberOfInstances: number;
  cardOrigin: CardOrigin;

  constructor(forgeSlotIndex: number, numberOfInstances: number, cardOrigin: CardOrigin) {
    super(ActionType.AddCraftedCardToDeck);
    this.forgeSlotIndex = forgeSlotIndex;
    this.numberOfInstances = numberOfInstances;
    this.cardOrigin = cardOrigin;
  }

  json():any {
    return {
      type: this.type,
      forgeSlotIndex: this.forgeSlotIndex,
      numberOfInstances: this.numberOfInstances,
    };
  }

  execute(game: Game):TurnActionResult {
    this.validate(game);
    const result = new TurnActionResult(game);
    const cardSet = this.createCardSet(result);
    this.addCardsToDiscard(result, cardSet);
    this.removeDraftCardFromForge(result);
    return result;
  }

  validate(game: Game) {
    if (game.phase !== GamePhase.Draft) {
      throw new Error(`game phase: ${game.phase} should be ${GamePhase.Draft}`);
    }
    if (!this.cardOrigin.name) {
      throw new Error(`the card requires a name`);
    }
    if (game.player.craftingTable.forge.length <= this.forgeSlotIndex) {
      throw new Error(`invalid forge slot index: ${this.forgeSlotIndex} with ${game.player.craftingTable.forge.length} forge slot(s) to pick from`);
    }
    const card = game.player.craftingTable.forge[this.forgeSlotIndex].card;
    if (!card) {
      throw new Error(`the forge slot: ${this.forgeSlotIndex} must contain a card`);
    }
    if (this.numberOfInstances > game.player.craftingTable.getMaxNumberOfDraftedInstances(card.rarity)) {
      throw new Error(`invalid number of instances: ${this.numberOfInstances} for card rarity of: ${card.rarity} that can have up to: ${game.player.craftingTable.getMaxNumberOfDraftedInstances(card.rarity)} instances`);
    }
  }

  createCardSet(result: TurnActionResult):CardSet {
    const draftCard = result.game.player.craftingTable.forge[this.forgeSlotIndex].card;
    const card = draftCard.buildCard();
    card.name = this.cardOrigin.name;
    const cardSet = new CardSet(card);
    for (let i = 0; i < this.numberOfInstances; i++) {
      cardSet.createInstance();
    }
    result.game.setCardSet(cardSet);
    result.recordCardSetAddition(cardSet);
    return cardSet;
  }

  addCardsToDiscard(result: TurnActionResult, cardSet: CardSet) {
    const instances = cardSet.getInstances();
    for (const instance of instances) {
      result.game.player.discardDeck.add(instance);
    }
    result.recordGameChange(GameChange.PlayerDiscardDeck);
  }

  removeDraftCardFromForge(result: TurnActionResult) {
    result.game.player.craftingTable.forge[this.forgeSlotIndex].empty();
    result.recordGameChange(GameChange.PlayerForge);
  }
}
