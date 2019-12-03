import { Player } from "../../entities/player/player";
import { CardSet } from "../../../card/entities/card-set";
import { StatusBuilder } from "./status-builder";
import { DeckBuilder } from "./deck-builder";
import { PlayerFieldSlot } from "../../entities/field-slot";
import { FieldSlotBuilder } from "./field-slot-builder";

export class PlayerBuilder {
  static buildPlayer(playerData: any, cardSets: Record<string, CardSet>):Player {
    const player = new Player(playerData.id, playerData.name, 0, 0, 0);
    player.health = StatusBuilder.buildStatus(playerData.health);
    player.energy = StatusBuilder.buildStatus(playerData.energy);
    player.field = PlayerBuilder.buildPlayerField(playerData.field, cardSets);
    player.hand = DeckBuilder.buildPlayerHand(playerData.hand, cardSets);
    player.drawDeck = DeckBuilder.buildPlayerDrawDeck(playerData.drawDeck, cardSets);
    player.discardDeck = DeckBuilder.buildPlayerDiscardDeck(playerData.discardDeck, cardSets);
    player.lostDeck = DeckBuilder.buildPlayerLostDeck(playerData.lostDeck, cardSets);
    return player;
  }

  private static buildPlayerField(fieldData: any[], cardSets: Record<string, CardSet>):PlayerFieldSlot[] {
    const field = [];
    for (const slot of fieldData) {
      field.push(FieldSlotBuilder.buildPlayerFieldSlot(slot, cardSets));
    }
    return field;
  }
}