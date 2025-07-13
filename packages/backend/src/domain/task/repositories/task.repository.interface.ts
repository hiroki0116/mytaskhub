import { Task } from "../entities/task.entity";

export interface ITaskRepository {
  findById(id: string, userId: string): Promise<Task | null>;
  findManyByUserId(userId: string): Promise<Task[]>;
  findManyByProjectId(projectId: string, userId: string): Promise<Task[]>;
  save(task: Task): Promise<Task>;
  delete(id: string, userId: string): Promise<void>;
}

export const TASK_REPOSITORY = "TASK_REPOSITORY";
