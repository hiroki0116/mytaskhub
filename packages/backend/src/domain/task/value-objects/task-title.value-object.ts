export class TaskTitle {
  private readonly value: string;
  constructor(value: string) {
    this.value = value;
  }

  public static create(title: string): TaskTitle {
    if (!TaskTitle.isValid(title)) {
      throw new Error("無効なタイトルです");
    }

    return new TaskTitle(title);
  }

  public static isValid(title: string): boolean {
    return title.length > 0;
  }

  public equals(title: string): boolean {
    return this.value === title;
  }

  public getValue(): string {
    return this.value;
  }

  toJSON(): string {
    return this.value;
  }
}
