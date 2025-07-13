import { Project } from "../entities/project.entity";

export interface IProjectRepository {
  findById(id: string, userId: string): Promise<Project | null>;
  findManyByUserId(userId: string): Promise<Project[]>;
  save(project: Project): Promise<Project>;
  delete(id: string, userId: string): Promise<void>;
}

export const PROJECT_REPOSITORY = "PROJECT_REPOSITORY";
