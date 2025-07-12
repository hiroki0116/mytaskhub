import { Injectable } from "@nestjs/common";
import { Task } from "../../domain/task/entities/task.entity";
import { Task as PrismaTask } from "@prisma/client";
import { TaskStatusEnum } from "../../domain/task/value-objects/task-status.value-object";
import { PriorityEnum } from "../../domain/task/value-objects/task-priority.value-object";

@Injectable()
export class TaskMapper {
  toDomain(prismaTask: PrismaTask): Task {
    return Task.create(
      prismaTask.id,
      prismaTask.title,
      prismaTask.status as TaskStatusEnum,
      prismaTask.priority as PriorityEnum,
      prismaTask.projectId,
      prismaTask.userId,
      prismaTask.content || undefined,
      prismaTask.deadline || undefined
    );
  }

  toPersistence(task: Task): Omit<PrismaTask, "createdAt" | "updatedAt"> {
    return {
      id: task.id,
      title: task.title,
      content: task.content,
      status: task.status as any,
      priority: task.priority,
      deadline: task.deadline,
      completedAt: task.completedAt,
      projectId: task.projectId,
      userId: task.userId,
    };
  }
}
