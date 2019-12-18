import { GameBuilder } from './game-builder';

const EXAMPLE_NEW_GAME = {
  "cardSets": {
    "CD_GP1": {
      "baseCard": {
        "abilities": [],
        "attack": 1,
        "cost": 0,
        "hash": "CD_GP1",
        "health": 3,
        "id": "CD_GP1",
        "level": 1,
        "name": "Goblin Peon",
        "range": 1,
        "rarity": "common",
        "type": "minion"
      },
      "instances": [
        {
          "id": "CR_ZrVKxYUTDuPG"
        },
        {
          "id": "CR_Y9xfiyb6vbNs"
        },
        {
          "id": "CR_sh9ln6C1wEmy"
        },
        {
          "id": "CR_l97Qz1RC9Jhx"
        },
        {
          "id": "CR_oT7vjEW9sNbR"
        },
        {
          "id": "CR_oPs8Rskqi8s0"
        },
        {
          "id": "CR_blHi94Xk6ell"
        },
        {
          "id": "CR_Z0PXo90b1reG"
        },
        {
          "id": "CR_WNmfo6jKA09f"
        },
        {
          "id": "CR_ZYg46BxXxC4c"
        },
        {
          "id": "CR_eF56EiVmqKWY"
        },
        {
          "id": "CR_kZP1izjp0bW2"
        },
        {
          "id": "CR_CesiPcx4mO1h"
        }
      ]
    },
    "CD_IU1": {
      "baseCard": {
        "abilities": [],
        "attack": 3,
        "cost": 0,
        "hash": "CD_IU1",
        "health": 1,
        "id": "CD_IU1",
        "level": 1,
        "name": "Imp Underling",
        "range": 1,
        "rarity": "common",
        "type": "minion"
      },
      "instances": [
        {
          "id": "CR_yBHhJvP4JKKV"
        },
        {
          "id": "CR_Q55HRZg8zc1A"
        },
        {
          "id": "CR_J0GjEo32lc18"
        },
        {
          "id": "CR_fEANsp6s1oI8"
        },
        {
          "id": "CR_g4H6s4KaqntE"
        },
        {
          "id": "CR_cCGibAI8gu5A"
        },
        {
          "id": "CR_kVzwoZ3BlQZG"
        },
        {
          "id": "CR_NQQaaZlAz0uc"
        }
      ]
    },
    "MS312": {
      "baseCard": {
        "abilities": [],
        "attack": 1,
        "cost": 1,
        "hash": "MS312",
        "health": 3,
        "id": "CP_WS1",
        "name": "Common Wisp",
        "range": 2,
        "rarity": "standard",
        "type": "minion"
      },
      "instances": [
        {
          "id": "CR_aImCUD9B7Dpl"
        },
        {
          "id": "CR_Ink07emK7cJ6"
        },
        {
          "id": "CR_1IYYLclv3qL9"
        },
        {
          "id": "CR_J0hZOBxtBEal"
        },
        {
          "id": "CR_sIJXsTIMXxJl"
        },
        {
          "id": "CR_eLtN4CyI0sPX"
        },
        {
          "id": "CR_76TDjnCRYfrO"
        },
        {
          "id": "CR_jdcKUEgDTo0l"
        },
        {
          "id": "CR_DSb85MWnvK8p"
        }
      ]
    },
    "SS000|A;EN1": {
      "baseCard": {
        "abilities": [
          {
            "amount": 1,
            "id": "energize",
            "tier": "godly"
          }
        ],
        "cost": 0,
        "hash": "SS000|A;EN1",
        "id": "CP_EN1",
        "name": "Energize",
        "rarity": "standard",
        "type": "spell"
      },
      "instances": [
        {
          "id": "CR_XyHDwmC6Qlbp"
        }
      ]
    }
  },
  "dungeon": {
    "field": [
      {
        "backlog": {
          "size": 6
        },
        "card": {
          "hash": "CD_GP1",
          "id": "CR_ZrVKxYUTDuPG"
        }
      },
      {
        "backlog": {
          "size": 6
        },
        "card": {
          "hash": "CD_IU1",
          "id": "CR_fEANsp6s1oI8"
        }
      },
      {
        "backlog": {
          "size": 6
        },
        "card": {
          "hash": "CD_GP1",
          "id": "CR_ZYg46BxXxC4c"
        }
      }
    ]
  },
  "id": "sfqABiRkytj6yY4QigBI",
  "player": {
    "discardDeck": {
      "cards": []
    },
    "drawDeck": {
      "size": 5
    },
    "energy": {
      "current": 10,
      "max": 10
    },
    "field": [
      {
        "card": null
      },
      {
        "card": null
      },
      {
        "card": null
      }
    ],
    "hand": {
      "cards": [
        {
          "hash": "SS000|A;EN1",
          "id": "CR_XyHDwmC6Qlbp"
        },
        {
          "hash": "MS312",
          "id": "CR_DSb85MWnvK8p"
        },
        {
          "hash": "MS312",
          "id": "CR_1IYYLclv3qL9"
        },
        {
          "hash": "MS312",
          "id": "CR_sIJXsTIMXxJl"
        },
        {
          "hash": "MS312",
          "id": "CR_jdcKUEgDTo0l"
        }
      ],
      "refillSize": 5
    },
    "health": {
      "current": 20,
      "max": 20
    },
    "id": "US_1",
    "lostDeck": {
      "cards": []
    },
    "name": "rhyeen"
  }
};

test('actual game data from backend', () => {
  const gameData = EXAMPLE_NEW_GAME;
  const game = GameBuilder.buildGame(gameData);
  expect(game.json(true, true)).toEqual(gameData);
});

test('ensure copy works', () => {
  const gameData = EXAMPLE_NEW_GAME;
  const game = GameBuilder.buildGame(gameData);
  const newGame = game.copy();
  expect(newGame.json(true, true)).toEqual(gameData);
});

