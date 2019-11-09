import { CardBuilder } from "./card-builder";
import { CardAbility } from "../entities/card-ability";

export class AbilityRetriever {
  static getDefaultedAbility(abilityId: string): CardAbility {
    return CardBuilder.buildCardAbility(abilityId);
  }
}