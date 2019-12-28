import { DraftCard } from "../entities/draft-card/draft-card";
import { CraftingPart } from "../entities/crafting-part";

export interface AddCraftingPartReturn {
  draftCard: DraftCard;
  wasModified: boolean;
}

export class DraftCardModifier {
  static addCraftingPart(draftCard: DraftCard, craftingPart: CraftingPart, mutateParams?: boolean):AddCraftingPartReturn {
    let returnDraftCard = draftCard;
    if (mutateParams) {
      returnDraftCard = draftCard.copy();
    }
    const wasModified = returnDraftCard.addCraftingPart(craftingPart);
    return {
      draftCard: returnDraftCard,
      wasModified
    };
  }
}
