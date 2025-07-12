export enum TaskStatusEnum {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
  ARCHIVED = "ARCHIVED",
}

export class TaskStatus {
  constructor(private readonly value: TaskStatusEnum) {}

  public static create(status: TaskStatusEnum): TaskStatus {
    if (!TaskStatus.isValid(status)) {
      throw new Error("無効なタスクステータスです");
    }

    return new TaskStatus(status);
  }

  public static isValid(status: TaskStatusEnum): boolean {
    return Object.values(TaskStatusEnum).includes(status);
  }

  public getValue(): TaskStatusEnum {
    return this.value;
  }

  public equals(other: TaskStatus): boolean {
    return this.value === other?.value;
  }

  public toJSON(): string {
    return this.value;
  }
}
