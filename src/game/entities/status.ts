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
    if (this._current > this.max) {
      this._current = this.max;
    }
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

  decrease(value: number) {
    this.current -= value;
  }

  increase(value: number) {
    this.current += value;
  }

  copy():Status {
    const status = new Status(this.max);
    status.current = this.current;
    return status;
  }

  json(reduce?: boolean):any {
    if (reduce) {
      return this.max;
    }
    return {
      max: this.max,
      current: this.current
    }
  }
}