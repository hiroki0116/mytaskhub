import { PriorityEnum } from "../../../../domain/task/value-objects/task-priority.value-object";
import { TaskStatusEnum } from "../../../../domain/task/value-objects/task-status.value-object";
import { Task } from "../../../../domain/task/entities/task.entity";

export class TaskResponseDto {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly status: TaskStatusEnum,
    public readonly priority: PriorityEnum,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly projectId: string,
    public readonly userId: string,
    public readonly content?: string,
    public readonly deadline?: Date,
    public readonly completedAt?: Date
  ) {}

  static fromEntity(task: Task) {
    return new TaskResponseDto(
      task.id,
      task.title,
      task.status,
      task.priority,
      task.createdAt,
      task.updatedAt,
      task.projectId,
      task.userId,
      task.content ?? undefined,
      task.deadline ?? undefined,
      task.completedAt ?? undefined
    );
  }
}
