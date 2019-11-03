import { StaticCardAbilityId, VariableCardAbilityId } from "../enums/card-ability";
import { CardAbilityHaste, CardAbilityEnergize, CardAbilityReach, CardAbilitySpellshot, CardAbility } from "../entities/card-ability";

export class AbilityRetriever {
  static getDefaultedAbility(abilityId: string): CardAbility {
    switch(abilityId) {
      case StaticCardAbilityId.Haste:
        return new CardAbilityHaste();
      case VariableCardAbilityId.Energize:
        return new CardAbilityEnergize(0);
      case VariableCardAbilityId.Reach:
        return new CardAbilityReach(0);
      case VariableCardAbilityId.Spellshot:
        return new CardAbilitySpellshot(0);
      default:
        throw new Error(`unexpected ability id: ${abilityId}`);
    }
  }
}