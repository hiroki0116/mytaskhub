export enum PriorityEnum {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export class TaskPriority {
  constructor(private readonly value: PriorityEnum) {}

  public static create(value: PriorityEnum): TaskPriority {
    if (!TaskPriority.isValid(value)) {
      throw new Error("無効な優先順位です");
    }

    return new TaskPriority(value);
  }

  public static isValid(priority: PriorityEnum) {
    return Object.values(PriorityEnum).includes(priority);
  }

  public equals(other: PriorityEnum): boolean {
    return this.value === other;
  }

  public getValue(): PriorityEnum {
    return this.value;
  }

  toJSON(): PriorityEnum {
    return this.value;
  }
}
