export class ProjectId {
  constructor(private readonly value: string) {}

  public static create(projectId: string): ProjectId {
    if (!ProjectId.isValid(projectId)) {
      throw new Error("無効なプロジェクトID形式です");
    }

    return new ProjectId(projectId);
  }

  public static isValid(projectId: string): boolean {
    // cuid()は通常25文字程度で、英数字と一部の特殊文字を含む
    const projectIdRegex = /^[a-zA-Z0-9_\- ]{25,}$/;
    return projectIdRegex.test(projectId);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(projectId: ProjectId): boolean {
    return projectId.value === this.value;
  }

  toJSON(): string {
    return this.value;
  }
}
