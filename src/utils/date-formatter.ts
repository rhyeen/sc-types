export class DateFormatter {
  static fromString(value: string):Date {
    return new Date(value);
  }

  static toString(value: Date):string {
    if (!value) {
      return null;
    }
    return JSON.parse(JSON.stringify(value));
  }
}