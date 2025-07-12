import { PriorityEnum } from "../../../../domain/task/value-objects/task-priority.value-object";
import { TaskStatusEnum } from "../../../../domain/task/value-objects/task-status.value-object";
import { Task } from "../../../../domain/task/entities/task.entity";

export class TaskResponseDto {
  id: string;
  title: string;
  status: TaskStatusEnum;
  priority: PriorityEnum;
  createdAt: Date;
  updatedAt: Date;
  projectId: string;
  userId: string;
  content?: string;
  deadline?: Date;
  completedAt?: Date;
  constructor(
    id: string,
    title: string,
    status: TaskStatusEnum,
    priority: PriorityEnum,
    createdAt: Date,
    updatedAt: Date,
    projectId: string,
    userId: string,
    content?: string,
    deadline?: Date,
    completedAt?: Date
  ) {
    this.id = id;
    this.title = title;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.projectId = projectId;
    this.userId = userId;
    this.priority = priority;
    this.content = content;
    this.deadline = deadline;
    this.completedAt = completedAt;
  }

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
