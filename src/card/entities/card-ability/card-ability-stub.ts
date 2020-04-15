// @NOTE: this will be what game.ts (and everything below it) references since
// CardAbility itself references game and we don't want a cyclical dependency.
export class CardAbilityStub {
  id: string;
  isUsed: boolean;
  variables?: Record<string, number>;
  currentCooldown: number;
  maxCooldown?: number;

  constructor(id: string, isUsed: boolean, variables?: Record<string, number>, currentCooldown?: number, maxCooldown?: number) {
    this.id = id;
    this.isUsed = isUsed;
    this.variables = variables;
    this.currentCooldown = currentCooldown;
    if (currentCooldown) {
      this.currentCooldown = currentCooldown;
    } else {
      this.currentCooldown = 0;
    }
    this.maxCooldown = maxCooldown;
  }

  resetIsUsed(): void {
    this.isUsed = false;
  }

  resetCooldown(): void {
    if (this.maxCooldown) {
      this.currentCooldown = this.maxCooldown;
    } else {
      this.currentCooldown = 0;
    }
  }

  protected checkAndDecreaseCooldown(triggered: boolean): boolean {
    if (!this.maxCooldown) {
      return triggered;
    }
    if (!triggered) {
      return false;
    }
    if (this.currentCooldown <= 0) {
      this.resetCooldown();
      return true;
    }
    this.currentCooldown -= 1;
    return false;
  }
}
