export class ProjectName {
  constructor(private readonly value: string) {}

  public static create(value: string): ProjectName {
    if (!value || value.trim() === "") {
      throw new Error("無効なプロジェクト名形式です");
    }
    return new ProjectName(value);
  }

  public getValue(): string {
    return this.value;
  }

  toJSON(): string {
    return this.value;
  }
}
