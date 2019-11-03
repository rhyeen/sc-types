import { ValueEnsurer } from "../services/value-ensurer";

export class Status {
  private _current: number;
  private _max: number;

  constructor(max: number) {
    this.current = max;
    this.max = max;
  }

  set current(value: number) {
    this._current = ValueEnsurer.ensureNonNegative(value);
  }

  get current() {
    return this._current;
  }

  set max(value: number) {
    this._max = ValueEnsurer.ensureNonNegative(value);
  }

  get max() {
    return this._max;
  }

  reset() {
    this.current = this.max;
  }

  copy():Status {
    const status = new Status(this.max);
    status.current = this.current;
    return status;
  }
}