export class TaskId {
  constructor(private readonly value: string) {}

  public static create(taskId: string): TaskId {
    if (!TaskId.isValid(taskId)) {
      throw new Error("無効なタスクID形式です");
    }

    return new TaskId(taskId);
  }

  public static isValid(taskId: string): boolean {
    // cuid()は通常25文字程度で、英数字と一部の特殊文字を含む
    const taskIdRegex = /^[a-zA-Z0-9_\- ]{25,}$/;
    return taskIdRegex.test(taskId);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(taskId: TaskId): boolean {
    return taskId.value === this.value;
  }

  public toJSON(): string {
    return this.value;
  }
}
