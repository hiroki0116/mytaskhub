export class TaskContent {
  private readonly value: string;

  constructor(value: string) {
    this.value = value;
  }

  public static create(value: string): TaskContent | null {
    if (!value || value.trim() === "") {
      return null;
    }
    return new TaskContent(value);
  }

  public getValue(): string {
    return this.value;
  }

  toJSON(): string {
    return this.value;
  }
}
