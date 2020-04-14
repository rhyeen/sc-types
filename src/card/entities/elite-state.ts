import { CardAbility } from "./card-ability";
import { AbilityRetriever } from "../services/ability-retriever";

export class EliteState {
  appliedEliteState: boolean;
  turnCounter: number;
  extraAbilities: CardAbility[];
  explodeAbilities: CardAbility[];
  extraHealth: number;
  extraRange: number;
  extraAttack: number;
  private eliteStateTurnCount: number;
  private explodeStateTurnCount: number;
  
  constructor(
    turnsUntilElite: number,
    turnsUntilExplodeAfterElite: number,
    appliedEliteState?: boolean,
    currentTurnCounter?: number,
    extraAbilities?: CardAbility[],
    explodeAbilities?: CardAbility[],
    extraHealth?: number,
    extraAttack?: number,
    extraRange?: number,
  ) {
    this.eliteStateTurnCount = turnsUntilElite;
    this.explodeStateTurnCount = turnsUntilExplodeAfterElite;
    if (currentTurnCounter) {
      this.turnCounter = currentTurnCounter;
    } else {
      this.turnCounter = 0;
    }
    if (extraAbilities) {
      this.extraAbilities = extraAbilities;
    } else {
      this.extraAbilities = [];
    }
    if (explodeAbilities) {
      this.explodeAbilities = explodeAbilities;
    } else {
      this.explodeAbilities = AbilityRetriever.getDefaultEliteMinionExplodeAbilities();
    }
    if (extraHealth) {
      this.extraHealth = extraHealth;
    } else {
      this.extraHealth = 0;
    }
    if (extraAttack) {
      this.extraAttack = extraAttack;
    } else {
      this.extraAttack = 0;
    }
    if (extraRange) {
      this.extraRange = extraRange;
    } else {
      this.extraRange = 0;
    }
    if (appliedEliteState) {
      this.appliedEliteState = appliedEliteState;
    } else {
      this.appliedEliteState = false;
    }
  }

  get turnsUntilElite():number {
    const turns = this.eliteStateTurnCount - this.turnCounter;
    if (turns > 0) {
      return turns;
    }
    return 0;
  }

  get readyForEliteState():boolean {
    return this.turnsUntilElite === 0;
  }

  get turnsUntilExplode():number {
    const turns = this.eliteStateTurnCount + this.explodeStateTurnCount - this.turnCounter;
    if (turns > 0) {
      return turns;
    }
    return 0; 
  }

  get readyToExplode():boolean {
    return this.turnsUntilExplode === 0;
  }

  incrementTurn() {
    this.turnCounter += 1;
  }

  copy():EliteState {
    return new EliteState(
      this.turnsUntilElite,
      this.turnsUntilExplode,
      this.appliedEliteState,
      this.turnCounter,
      this.copyAbilities(this.extraAbilities),
      this.copyAbilities(this.explodeAbilities),
      this.extraHealth,
      this.extraAttack,
      this.extraRange,
    );
  }

  private copyAbilities(abilities: CardAbility[]):CardAbility[] {
    return abilities.map(ability => ability.copy());
  }

  json():any {
    return {
      turnsUntilElite: this.turnsUntilElite,
      turnsUntilExplode: this.turnsUntilExplode,
      appliedEliteState: this.appliedEliteState,
      turnCounter: this.turnCounter,
      extraAbilities: this.jsonAbilities(this.extraAbilities),
      explodeAbilities: this.jsonAbilities(this.explodeAbilities),
      extraHealth: this.extraHealth,
      extraAttack: this.extraAttack,
      extraRange: this.extraRange,
    };
  }

  private jsonAbilities(abilities: CardAbility[]):CardAbility[] {
    return abilities.map(ability => ability.json());
  }
}