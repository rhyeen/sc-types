import { Card } from "./card";
import { CardType } from "../../enums/card-type"
import { CardRarity } from "../../enums/card-rarity";
import { CardAbility } from "../card-ability";
import { copyCardAbilities } from "../../card.interface";

export class SpellCard extends Card {
  constructor(rarity: CardRarity, abilities?: CardAbility[], cost?: number, cardName?: string, cardId?: string, cardHash?: string) {
    super(rarity, CardType.Spell, abilities, cost, cardName, cardId, cardHash);
  }

  copy():Card {
    const card = new SpellCard(this.rarity, copyCardAbilities(this.abilities), this.cost, this.name, this.id, this.hash);
    card.conditions = this.conditions.copy();
    return card;
  }
}
