import { Player } from './player/player';
import { Dungeon } from './dungeon';
import { CardSet } from '../../card/entities/card-set';
import { MinionCard } from '../../card/entities/card/minion-card';
import { GamePhase } from '../enums/game-phase';
import { Card } from '../../card/entities/card/card';

export class Game {
  id: string;
  player: Player;
  dungeon: Dungeon;
  cardSets: Record<string,CardSet>;
  phase: GamePhase;

  constructor(id: string, player: Player, dungeon: Dungeon, cardSets: Record<string,CardSet>, phase?: GamePhase) {
    this.id = id;
    this.player = player;
    this.dungeon = dungeon;
    this.cardSets = cardSets;
    if (phase) {
      this.phase = phase;
    } else {
      this.phase = GamePhase.Battle;
    }
  }

  copy():Game {
    const cardSets = this.copyCardSets();
    // @NOTE: the reason we need to pass through the cardsets is so that the copies of cards
    // within things like decks/fields uses the reference of the copied card sets so that
    // editing a card in a deck/field, edits the card within the card set.
    return new Game(this.id, this.player.copy(cardSets), this.dungeon.copy(cardSets), cardSets, this.phase);
  }

  private copyCardSets():Record<string,CardSet> {
    const cardSets = {};
    for (const record in this.cardSets) {
      cardSets[record] = this.cardSets[record].copy();
    }
    return cardSets;
  }

  start() {
    this.player.drawHand();
    this.player.refresh();
    this.dungeon.refillField();
    this.dungeon.refresh();
  }

  shiftPhase() {
    if (this.setIsOver()) {
      return;
    }
    switch (this.phase) {
      case GamePhase.Battle:
        this.phase = GamePhase.Draft;
        return;
      case GamePhase.Draft:
        this.phase = GamePhase.Battle;
        return;
      default:
        throw new Error(`unexpected game phase: ${this.phase}`);
    }
  }

  setIsOver():boolean {
    return this.setIsWon() || this.setIsLost();
  }

  isOver():boolean {
    return this.isWon() || this.isLost();
  }

  private setIsWon():boolean {
    if (this.isWon()) {
      this.phase = GamePhase.Win;
    }
    return this.isWon();
  }

  private isWon():boolean {
    return this.phase === GamePhase.Win || this.dungeon.isCleared();
  }

  private setIsLost():boolean {
    if (this.isLost()) {
      this.phase = GamePhase.Lose;
    }
    return this.isLost();
  }

  private isLost():boolean {
    return this.phase === GamePhase.Lose || this.player.isDead();
  }

  getCard(cardHash: string, cardId: string):Card {
    if (!(cardHash in this.cardSets)) {
      throw new Error(`cardHash: ${cardHash} does not exist in game's cardSets`);
    }
    return this.cardSets[cardHash].getInstance(cardId);
  }

  json(reduce?: boolean, hidePrivate?: boolean):any {
    return {
      id: this.id,
      player: this.player.json(hidePrivate),
      dungeon: this.dungeon.json(hidePrivate),
      cardSets: this.jsonCardSets(reduce),
      phase: this.phase
    };
  }

  setCardSet(cardSet: CardSet) {
    this.cardSets[cardSet.baseCard.hash] = cardSet;
  }

  private jsonCardSets(reduce?: boolean):any {
    const cardSets = {};
    for (const record in this.cardSets) {
      cardSets[record] = this.cardSets[record].json(reduce);
    }
    return cardSets;
  }

  getValidPlayerMinionAttackTargets(playerSourceFieldIndex: number):number[] {
    const validAttackTargetFieldIndices = [];
    const card = this.player.field[playerSourceFieldIndex].card;
    if (!(card instanceof MinionCard)) {
      return [];
    }
    for (let i = 0; i < this.dungeon.field.length; i += 1) {
      if (card.range >= Game.getRangeToTarget(playerSourceFieldIndex, i)) {
        validAttackTargetFieldIndices.push(i);
      }
    }
    return validAttackTargetFieldIndices;
  }

  getValidDungeonMinionAttackTargets(dungeonSourceFieldIndex: number):number[] {
    const validAttackTargetFieldIndices = [];
    const card = this.dungeon.field[dungeonSourceFieldIndex].card;
    if (!(card instanceof MinionCard)) {
      return [];
    }
    for (let i = 0; i < this.player.field.length; i += 1) {
      if (card.range >= Game.getRangeToTarget(dungeonSourceFieldIndex, i)) {
        validAttackTargetFieldIndices.push(i);
      }
    }
    return validAttackTargetFieldIndices;
  }

  /**
   * A dungeon minion can attack the player directly, if a player's field slot is in range
   * and doesn't contain a minion card.
   */
  canDungeonMinionAttackPlayer(dungeonSourceFieldIndex: number):boolean {
    const fieldIndices = this.getValidDungeonMinionAttackTargets(dungeonSourceFieldIndex);
    for (const fieldIndex of fieldIndices) {
      if (!this.player.field[fieldIndex].card) {
        return true;
      }
    }
    return false;
  }

  private static getRangeToTarget(sourceIndex: number, targetIndex: number):number {
    return Math.abs(sourceIndex - targetIndex) + 1;
  }

  dungeonCardCanRetaliate(playerSourceFieldIndex: number, dungeonTargetFieldIndex: number):boolean {
    const targetCard = this.dungeon.field[dungeonTargetFieldIndex].card;
    if (!(targetCard instanceof MinionCard)) {
      return false;
    }
    return targetCard.range >= Game.getRangeToTarget(playerSourceFieldIndex, dungeonTargetFieldIndex);
  }

  playerCardCanRetaliate(dungeonSourceFieldIndex: number, playerTargetFieldIndex: number):boolean {
    const targetCard = this.player.field[playerTargetFieldIndex].card;
    if (!(targetCard instanceof MinionCard)) {
      return false;
    }
    return targetCard.range >= Game.getRangeToTarget(dungeonSourceFieldIndex, playerTargetFieldIndex);
  }
}
