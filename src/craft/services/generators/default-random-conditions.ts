import { CardType } from "../../../card/enums/card-type";
import { CardRarity } from "../../../card/enums/card-rarity";
import { StaticCardAbilityId, VariableCardAbilityId, CardAbilityTier } from "../../../card/enums/card-ability";
import { CraftingPartType, CraftingPartStatType } from "../../../card/enums/crafting-part";

function getDefaultCardRarityWeights():any {
  return [
    {
      percentComplete: 0,
      weights: [
        { weight: 90, value: CardRarity.Common},
        { weight: 10, value: CardRarity.Rare},
        { weight: 1, value: CardRarity.Epic},
        { weight: 0.1, value: CardRarity.Legendary}
      ]
    },
    {
      percentComplete: .25,
      weights: [
        { weight: 50, value: CardRarity.Common},
        { weight: 50, value: CardRarity.Rare},
        { weight: 5, value: CardRarity.Epic},
        { weight: 0.5, value: CardRarity.Legendary}
      ]
    },
    {
      percentComplete: .5,
      weights: [
        { weight: 25, value: CardRarity.Common},
        { weight: 50, value: CardRarity.Rare},
        { weight: 25, value: CardRarity.Epic},
        { weight: 1, value: CardRarity.Legendary}
      ]
    },
    {
      percentComplete: .75,
      weights: [
        { weight: 10, value: CardRarity.Common},
        { weight: 25, value: CardRarity.Rare},
        { weight: 25, value: CardRarity.Epic},
        { weight: 5, value: CardRarity.Legendary}
      ]
    },
    {
      percentComplete: 1,
      weights: [
        { weight: 0, value: CardRarity.Common},
        { weight: 10, value: CardRarity.Rare},
        { weight: 30, value: CardRarity.Epic},
        { weight: 10, value: CardRarity.Legendary}
      ]
    }
  ];
}

export function getDefaultBaseDraftCardRandomConditions():any {
  return {
    cardType: [
      {
        weight: 1,
        value: CardType.Spell
      },
      {
        weight: 1,
        value: CardType.Minion
      }
    ],
    cardRarity: getDefaultCardRarityWeights(),
    minionStats: [
      {
        cardRarity: CardRarity.Common,
        weights: [
          { weight: 80, value: { health: 1, attack: 0, range: 1 }},
          { weight: 10, value: { health: 1, attack: 1, range: 1 }},
          { weight: 10, value: { health: 2, attack: 0, range: 1 }},
          { weight: 5, value: { health: 1, attack: 2, range: 1 }},
        ]
      },
      {
        cardRarity: CardRarity.Rare,
        weights: [
          { weight: 80, value: { health: 1, attack: 1, range: 1 }},
          { weight: 10, value: { health: 2, attack: 2, range: 1 }},
          { weight: 10, value: { health: 3, attack: 0, range: 1 }},
          { weight: 5, value: { health: 1, attack: 3, range: 2 }},
          { weight: 5, value: { health: 1, attack: 1, range: 3 }},
        ]
      },
      {
        cardRarity: CardRarity.Epic,
        weights: [
          { weight: 50, value: { health: 1, attack: 1, range: 1 }},
          { weight: 50, value: { health: 2, attack: 2, range: 1 }},
          { weight: 10, value: { health: 2, attack: 3, range: 1 }},
          { weight: 10, value: { health: 5, attack: 0, range: 1 }},
          { weight: 5, value: { health: 1, attack: 3, range: 3 }},
        ]
      },
      {
        cardRarity: CardRarity.Legendary,
        weights: [
          { weight: 80, value: { health: 5, attack: 3, range: 2 }},
          { weight: 10, value: { health: 3, attack: 3, range: 3 }},
          { weight: 10, value: { health: 9, attack: 1, range: 1 }},
          { weight: 5, value: { health: 3, attack: 7, range: 2 }},
        ]
      }
    ],
    minionAbilities: [
      {
        cardRarity: CardRarity.Common,
        weights: [
          { weight: 1, value: { id: StaticCardAbilityId.Haste }}
        ]
      },
      {
        cardRarity: CardRarity.Rare,
        weights: [
          { weight: 1, value: { id: StaticCardAbilityId.Haste }}
        ]
      },
      {
        cardRarity: CardRarity.Epic,
        weights: [
          { weight: 1, value: { id: StaticCardAbilityId.Haste }}
        ]
      },
      {
        cardRarity: CardRarity.Legendary,
        weights: [
          { weight: 1, value: { id: StaticCardAbilityId.Haste }}
        ]
      }
    ],
    minionSlots: [
      {
        cardRarity: CardRarity.Common,
        weights: [
          { weight: 1, value: { tier: CardAbilityTier.Minion3 }}
        ]
      },
      {
        cardRarity: CardRarity.Rare,
        weights: [
          { weight: 1, value: { tier: CardAbilityTier.Minion3 }}
        ]
      },
      {
        cardRarity: CardRarity.Epic,
        weights: [
          { weight: 1, value: { tier: CardAbilityTier.Minion3 }}
        ]
      },
      {
        cardRarity: CardRarity.Legendary,
        weights: [
          { weight: 1, value: { tier: CardAbilityTier.Minion3 }}
        ]
      }
    ],
    spellAbilities: [
      {
        cardRarity: CardRarity.Common,
        weights: [
          { weight: 1, value: { id: VariableCardAbilityId.Reach }},
          { weight: 1, value: { id: VariableCardAbilityId.Spellshot }}
        ]
      },
      {
        cardRarity: CardRarity.Rare,
        weights: [
          { weight: 1, value: { id: VariableCardAbilityId.Reach }},
          { weight: 1, value: { id: VariableCardAbilityId.Spellshot }}
        ]
      },
      {
        cardRarity: CardRarity.Epic,
        weights: [
          { weight: 1, value: { id: VariableCardAbilityId.Reach }},
          { weight: 1, value: { id: VariableCardAbilityId.Spellshot }}
        ]
      },
      {
        cardRarity: CardRarity.Legendary,
        weights: [
          { weight: 1, value: { id: VariableCardAbilityId.Reach }},
          { weight: 1, value: { id: VariableCardAbilityId.Spellshot }}
        ]
      }
    ],
    spellSlots: [
      {
        cardRarity: CardRarity.Common,
        weights: [
          { weight: 1, value: { tier: CardAbilityTier.Spell3 }}
        ]
      },
      {
        cardRarity: CardRarity.Rare,
        weights: [
          { weight: 1, value: { tier: CardAbilityTier.Spell3 }}
        ]
      },
      {
        cardRarity: CardRarity.Epic,
        weights: [
          { weight: 1, value: { tier: CardAbilityTier.Spell3 }}
        ]
      },
      {
        cardRarity: CardRarity.Legendary,
        weights: [
          { weight: 1, value: { tier: CardAbilityTier.Spell3 }}
        ]
      }
    ],
  };
}

export function getDefaultCraftingPartRandomConditions():any {
  return {
    partType: [
      {
        weight: 1,
        value: CraftingPartType.Ability
      },
      {
        weight: 2,
        value: CraftingPartType.Stat
      }
    ],
    cardRarity: getDefaultCardRarityWeights(),
    statCraftingParts: [
      {
        cardRarity: CardRarity.Common,
        weights: [
          { weight: 2, value: { type: CraftingPartStatType.Attack, amount: 1 }},
          { weight: 2, value: { type: CraftingPartStatType.Health, amount: 1 }},
          { weight: 1, value: { type: CraftingPartStatType.Range, amount: 1 }},
        ]
      },
      {
        cardRarity: CardRarity.Rare,
        weights: [
          { weight: 2, value: { type: CraftingPartStatType.Attack, amount: 1 }},
          { weight: 2, value: { type: CraftingPartStatType.Health, amount: 1 }},
          { weight: 1, value: { type: CraftingPartStatType.Range, amount: 1 }},
          { weight: 1, value: { type: CraftingPartStatType.Attack, amount: 2 }},
          { weight: 1, value: { type: CraftingPartStatType.Health, amount: 2 }},
        ]
      },
      {
        cardRarity: CardRarity.Epic,
        weights: [
          { weight: 2, value: { type: CraftingPartStatType.Attack, amount: 1 }},
          { weight: 2, value: { type: CraftingPartStatType.Health, amount: 1 }},
          { weight: 1, value: { type: CraftingPartStatType.Range, amount: 1 }},
          { weight: 1, value: { type: CraftingPartStatType.Attack, amount: 2 }},
          { weight: 1, value: { type: CraftingPartStatType.Health, amount: 2 }},
          { weight: 1, value: { type: CraftingPartStatType.Attack, amount: 3 }},
          { weight: 1, value: { type: CraftingPartStatType.Health, amount: 3 }},
          { weight: 1, value: { type: CraftingPartStatType.Range, amount: 2 }},
        ]
      },
      {
        cardRarity: CardRarity.Legendary,
        weights: [
          { weight: 2, value: { type: CraftingPartStatType.Attack, amount: 2 }},
          { weight: 2, value: { type: CraftingPartStatType.Health, amount: 2 }},
          { weight: 1, value: { type: CraftingPartStatType.Range, amount: 2 }},
          { weight: 1, value: { type: CraftingPartStatType.Attack, amount: 3 }},
          { weight: 1, value: { type: CraftingPartStatType.Health, amount: 3 }},
          { weight: 1, value: { type: CraftingPartStatType.Attack, amount: 5 }},
          { weight: 1, value: { type: CraftingPartStatType.Health, amount: 5 }},
          { weight: 1, value: { type: CraftingPartStatType.Range, amount: 3 }},
        ]
      }
    ],
    abilityCraftingParts: [
      {
        cardRarity: CardRarity.Common,
        weights: [
          { weight: 1, value: { id: VariableCardAbilityId.Reach, amount: 1 }},
          { weight: 1, value: { id: VariableCardAbilityId.Spellshot, amount: 1 }},
          { weight: 1, value: { id: StaticCardAbilityId.Haste }}
        ]
      },
      {
        cardRarity: CardRarity.Rare,
        weights: [
          { weight: 1, value: { id: VariableCardAbilityId.Reach, amount: 1 }},
          { weight: 1, value: { id: VariableCardAbilityId.Spellshot, amount: 1 }},
          { weight: 1, value: { id: StaticCardAbilityId.Haste }}
        ]
      },
      {
        cardRarity: CardRarity.Epic,
        weights: [
          { weight: 1, value: { id: VariableCardAbilityId.Reach, amount: 1 }},
          { weight: 1, value: { id: VariableCardAbilityId.Spellshot, amount: 1 }},
          { weight: 1, value: { id: StaticCardAbilityId.Haste }}
        ]
      },
      {
        cardRarity: CardRarity.Legendary,
        weights: [
          { weight: 1, value: { id: VariableCardAbilityId.Reach, amount: 1 }},
          { weight: 1, value: { id: VariableCardAbilityId.Spellshot, amount: 1 }},
          { weight: 1, value: { id: StaticCardAbilityId.Haste }}
        ]
      }
    ],
  };
}