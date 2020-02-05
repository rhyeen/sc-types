import { ActionType } from "../../../enums/action-type";
import { TurnAction } from "../turn-action";
import { Game } from "../../../../game/entities/game";
import { TurnActionResult } from "../turn-action-result";
import { GamePhase } from "../../../../game/enums/game-phase";
import { StatCraftingPart } from "../../../../card/entities/crafting-part";
import { SpellDraftCard } from "../../../../card/entities/draft-card/spell-draft-card";
import { GameChange } from "../../../enums/game-change";

export class AddCraftingPartAction extends TurnAction {
  craftingPartIndex: number;
  forgeSlotIndex: number;

  constructor(craftingPartIndex: number, forgeSlotIndex: number) {
    super(ActionType.AddCraftingPart);
    this.craftingPartIndex = craftingPartIndex;
    this.forgeSlotIndex = forgeSlotIndex;
  }

  json():any {
    return {
      type: this.type,
      craftingPartIndex: this.craftingPartIndex,
      forgeSlotIndex: this.forgeSlotIndex
    };
  }

  execute(game: Game):TurnActionResult {
    this.validate(game);
    const result = new TurnActionResult(game);
    this.addCraftingPartToCard(result);
    this.removeCraftingPart(result);
    return result;
  }

  validate(game: Game) {
    if (game.phase !== GamePhase.Draft) {
      throw new Error(`game phase: ${game.phase} should be ${GamePhase.Draft}`);
    }
    if (game.player.craftingTable.forge.length <= this.forgeSlotIndex) {
      throw new Error(`invalid forge slot index: ${this.forgeSlotIndex} with ${game.player.craftingTable.forge.length} forge slot(s) to pick from`);
    }
    const card = this.getDraftCard(game);
    if (!card) {
      throw new Error(`the forge slot: ${this.forgeSlotIndex} must contain a card`);
    }
    if (game.player.craftingTable.craftingParts.length <= this.craftingPartIndex) {
      throw new Error(`invalid crafting part index: ${this.craftingPartIndex} with ${game.player.craftingTable.craftingParts.length} crafting part(s) to pick from`);
    }
    const craftingPart = this.getCraftingPart(game);
    if (game.player.craftingTable.remainingUsableCraftingParts <= 0) {
      throw new Error(`already used ${game.player.craftingTable.craftingPartsUsed} of ${game.player.craftingTable.maxCraftingPartsUsed} possible parts`);
    }
    if (card instanceof SpellDraftCard && craftingPart instanceof StatCraftingPart) {
      throw new Error(`spell cards cannot have a crafting part of type: ${craftingPart.type}`);
    }
  }

  private getDraftCard(game: Game) {
    return game.player.craftingTable.forge[this.forgeSlotIndex].card;
  }

  private getCraftingPart(game: Game) {
    return game.player.craftingTable.craftingParts[this.craftingPartIndex];
  }

  private addCraftingPartToCard(result: TurnActionResult) {
    this.getDraftCard(result.game).addCraftingPart(this.getCraftingPart(result.game));
    result.recordDraftCardChange(this.getDraftCard(result.game));
    result.recordGameChange(GameChange.PlayerForge);
  }

  private removeCraftingPart(result: TurnActionResult) {
    result.game.player.craftingTable.removeCraftingPart(this.craftingPartIndex);
    result.recordGameChange(GameChange.PlayerCraftingParts);
  }
}
