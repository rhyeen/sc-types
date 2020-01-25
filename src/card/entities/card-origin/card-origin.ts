import { DateFormatter } from "../../../utils/date-formatter";

export interface CardOriginOriginalData {
  playerId: string;
  gameId: string;
}

export interface CardArtCredit {
  artistId: string;
  originalSource?: string;
  creditedAt: Date;
}

export class CardArt {
  imageSource: string;
  credit: CardArtCredit;

  constructor() {
    this.credit = {
      artistId: null,
      creditedAt: null
    };
  }

  json():any {
    return {
      imageSource: this.imageSource,
      credit: {
        artistId: this.credit.artistId,
        originalSource: this.credit.originalSource,
        creditedAt: DateFormatter.toString(this.credit.creditedAt)
      }
    };
  }
}

export class CardOriginChange {
  changeTo: string; // key or key.subkey.nextsubkey from CardOrigin; for example: art.credit.artistId
  previousValue: any; // currentValue is just equal to what the next CardOriginChange previousValue is or what the current value is for that key.
  updatedAt: Date;
  updatedBy: string; // adminId

  json():any {
    return {
      changeTo: this.changeTo,
      previousValue: this.previousValue,
      updatedAt: this.updatedAt,
      updatedBy: this.updatedBy
    };
  }
}

export class CardOrigin {
  id: string;
  name: string;
  original: CardOriginOriginalData;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  art?: CardArt;
  history?: CardOriginChange[];

  constructor() {
    this.original = {
      playerId: null,
      gameId: null,
    };
  }

  json():any {
    return {
      id: this.id,
      name: this.name,
      original: {
        playerId: this.original.playerId,
        gameId: this.original.gameId
      },
      createdAt: DateFormatter.toString(this.createdAt),
      updatedAt: DateFormatter.toString(this.updatedAt),
      deletedAt: DateFormatter.toString(this.deletedAt),
      art: this.art ? this.art.json() : null,
      history: this.jsonHistory()
    };
  }

  jsonHistory():any[] {
    if (!this.history) {
      return null;
    }
    const result = [];
    for (const change of this.history) {
      result.push(change.json());
    }
    return result;
  }
}
