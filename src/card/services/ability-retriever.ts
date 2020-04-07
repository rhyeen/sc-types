import { CardBuilder } from "./builders/card-builder";
import { CardAbility, CardAbilityDirectHit } from "../entities/card-ability";

export class AbilityRetriever {
  static getDefaultedAbility(abilityId: string): CardAbility {
    return CardBuilder.buildCardAbility({id: abilityId });
  }

  static getDefaultEliteMinionExplodeAbilities(): CardAbility[] {
    return [new CardAbilityDirectHit(10)];
  }
}