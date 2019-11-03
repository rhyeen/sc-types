import { Card } from "./card";
import { CardType } from "../../enums/card-type"
import { CardRarity } from "../../enums/card-rarity";
import { CardAbility } from "../card-ability";

export class SpellCard extends Card {
  constructor(rarity: CardRarity, abilities?: CardAbility[], cost?: number, cardName?: string, cardId?: string, cardHash?: string) {
    super(rarity, CardType.Spell, abilities, cost, cardName, cardId, cardHash);
  }
}
