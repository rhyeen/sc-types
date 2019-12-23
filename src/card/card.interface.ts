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
  level?: number; // @NOTE: only for dungeon cards
}

export interface DraftCardInterface {
  type: CardType;
  rarity: CardRarity;
  slots?: DraftCardAbilitySlot[];
  cost?: number;
}

export function jsonCardInterface(cardInterface: CardInterface):any {
  const cardInterfaceData = {
    name: cardInterface.name,
    id: cardInterface.id,
    type: cardInterface.type,
    rarity: cardInterface.rarity,
    hash: cardInterface.hash,
    abilities: jsonCardAbilities(cardInterface.abilities),
    cost: cardInterface.cost
  }
  if (cardInterface.level) {
    cardInterfaceData['level'] = cardInterface.level;
  }
  if (cardInterface.type === CardType.Minion) {
    return {
      ...cardInterfaceData,
      health: cardInterface.health,
      range: cardInterface.range,
      attack: cardInterface.attack
    }
  }
  return cardInterfaceData;
}

export function copyCardInterface(cardInterface: CardInterface):CardInterface {
  return {
    name: cardInterface.name,
    id: cardInterface.id,
    type: cardInterface.type,
    rarity: cardInterface.rarity,
    hash: cardInterface.hash,
    abilities: copyCardAbilities(cardInterface.abilities),
    cost: cardInterface.cost,
    health: cardInterface.health,
    range: cardInterface.range,
    attack: cardInterface.attack,
    level: cardInterface.level
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

export function jsonCardAbilities(abilities: CardAbility[]):any[] {
  const abilitiesData = [];
  if (!abilities) {
    return abilitiesData;
  }
  for (const ability of abilities) {
    if (!(ability instanceof CardAbility)) {
      throw new Error(`ability (typeof: ${typeof ability}) is not of type: CardAbility`);
    }
    abilitiesData.push(ability.json());
  }
  return abilitiesData;
}