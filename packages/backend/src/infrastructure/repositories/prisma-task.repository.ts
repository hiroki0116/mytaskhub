import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { ITaskRepository } from "../../domain/task/repositories/task.repository.interface";
import { Task } from "../../domain/task/entities/task.entity";
import { TaskMapper } from "../mappers/task.mapper";

@Injectable()
export class PrismaTaskReposiroty implements ITaskRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly taskMapper: TaskMapper
  ) {}

  async findById(id: string, userId: string): Promise<Task | null> {
    const task = await this.prisma.task.findUnique({
      where: {
        id,
        userId,
      },
    });

    if (!task) {
      return null;
    }

    return this.taskMapper.toDomain(task);
  }

  async findManyByUserId(userId: string): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: {
        userId,
      },
    });

    return tasks.map((task) => this.taskMapper.toDomain(task));
  }

  async findManyByProjectId(projectId: string, userId: string): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: {
        projectId,
        userId,
      },
    });

    return tasks.map((task) => this.taskMapper.toDomain(task));
  }

  async save(task: Task): Promise<Task> {
    const taskData = this.taskMapper.toPersistence(task);
    const savedTask = await this.prisma.task.upsert({
      where: {
        id: taskData.id,
      },
      update: taskData,
      create: taskData,
    });

    return this.taskMapper.toDomain(savedTask);
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.prisma.task.deleteMany({
      where: {
        id,
        userId,
      },
    });
  }
}
