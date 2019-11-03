export class ValueEnsurer {
  static ensureNonNegative(value: number) {
    if (value < 0) {
      return 0;
    }
    return value;
  }
}