import { CardRarity } from "./enums/card-rarity";
import { CardType } from "./enums/card-type";
import { CardAbility } from "./entities/card-ability";
import { DraftCardAbilitySlot } from "./entities/draft-card-ability-slot";

export interface CardInterface {
  name: string;
  id: string;
  type: CardType;
  rarity: CardRarity;
  hash?: string;
  abilities?: CardAbility[];
  cost?: number;
  health?: number;
  range?: number;
  attack?: number;
}

export interface DraftCardInterface {
  type: CardType;
  rarity: CardRarity;
  slots?: DraftCardAbilitySlot[];
  cost?: number;
}

export function copyCardInterface(cardInterface: CardInterface):CardInterface {
  return {
    name: cardInterface.name,
    id: cardInterface.id,
    type: cardInterface.type,
    rarity: cardInterface.rarity,
    hash: cardInterface.hash,
    abilities: copyCardAbilities(cardInterface.abilities),
    cost: cardInterface.cost
  };
}

export function copyCardAbilities(abilities: CardAbility[]):CardAbility[] {
  const result = [];
  if (!abilities) {
    return result;
  }
  for (const ability of abilities) {
    result.push(ability.copy());
  }
  return result;
}