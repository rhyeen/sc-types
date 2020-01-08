import { CardOrigin, CardArt, CardOriginChange } from '../../entities/card-origin/card-origin';
import { DateFormatter } from '../../../utils/date-formatter';

export class CardOriginBuilder {
  static buildCardOrigin(cardOriginData: any):CardOrigin {
    const cardOrigin = new CardOrigin();
    cardOrigin.id = cardOriginData.id;
    cardOrigin.name = cardOriginData.name;
    cardOrigin.createdAt = DateFormatter.fromString(cardOriginData.createdAt);
    cardOrigin.updatedAt = DateFormatter.fromString(cardOriginData.updatedAt);
    cardOrigin.deletedAt = DateFormatter.fromString(cardOriginData.deletedAt);
    const originalData = cardOriginData.original;
    cardOrigin.original = {
      playerId: originalData.playerId,
      gameId: originalData.gameId
    };
    const cardArt = new CardArt();
    const artData = cardOriginData.art;
    if (artData) {
      cardArt.imageSource = artData.imageSource;
      cardArt.credit = {
        artistId: artData.credit.artistId,
        originalSource: artData.credit.originalSource,
        creditedAt: DateFormatter.fromString(artData.credit.creditedAt)
      };
    }
    cardOrigin.art = cardArt;
    cardOrigin.history = CardOriginBuilder.buildCardOriginHistory(cardOriginData.history);
    return cardOrigin;
  }

  static buildCardOriginHistory(historyData: any[]): CardOriginChange[] {
    const result = [];
    if (!historyData) {
      return null;
    }
    for (const changeData of historyData) {
      result.push({
        changeTo: changeData.changeTo,
        previousValue: changeData.previousValue,
        updatedAt: DateFormatter.fromString(changeData.updatedAt),
        updatedBy: changeData.updatedBy
      });
    }
    return result;
  } 
}