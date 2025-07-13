import { PriorityEnum } from "../../../domain/task/value-objects/task-priority.value-object";

export class ProjectDefaultPriority {
  constructor(private readonly value: PriorityEnum) {}

  public static create(value: PriorityEnum): ProjectDefaultPriority {
    if (!ProjectDefaultPriority.isValid(value)) {
      throw new Error("無効な優先度です");
    }

    return new ProjectDefaultPriority(value);
  }

  public static isValid(value: PriorityEnum): boolean {
    return Object.values(PriorityEnum).includes(value);
  }

  public getValue(): PriorityEnum {
    return this.value;
  }

  toJSON(): PriorityEnum {
    return this.value;
  }
}
