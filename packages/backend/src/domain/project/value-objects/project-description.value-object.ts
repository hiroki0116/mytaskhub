export class ProjectDescription {
  constructor(private readonly value: string) {}

  public static create(value: string): ProjectDescription | null {
    if (!value || value.trim() === "") {
      throw new Error("無効なプロジェクト説明形式です");
    }

    return new ProjectDescription(value);
  }

  public getValue(): string {
    return this.value;
  }

  toJSON(): string {
    return this.value;
  }
}
