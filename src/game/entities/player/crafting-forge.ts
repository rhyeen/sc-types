import { DraftCard } from "../../../card/entities/draft-card/draft-card";

export class CraftingForge {
    card?: DraftCard;

    constructor(card?: DraftCard) {
      if (card) {
        this.card = card;
      }
    }

    fill(card: DraftCard) {
      this.card = card;
    }

    json():any {
      if (!this.card) {
        return {
          card: null
        };
      }
      return {
        card: this.card.json()
      };
    }

    copy():any {
      if (!this.card) {
        return new CraftingForge();
      }
      return new CraftingForge(this.card.copy());
    }
}