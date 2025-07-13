import { Project } from "../../../../domain/project/entities/project.entity";
import { ProjectStatusEnum } from "../../../../domain/project/value-objects/project-status.value-object";
import { PriorityEnum } from "../../../../domain/task/value-objects/task-priority.value-object";

export class ProjectResponseDto {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly status: ProjectStatusEnum,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly userId: string,
    public readonly description?: string,
    public readonly defaultPriority?: PriorityEnum,
    public readonly clientId?: string
  ) {}

  static fromEntity(project: Project) {
    return new ProjectResponseDto(
      project.id,
      project.name,
      project.status,
      project.createdAt,
      project.updatedAt,
      project.userId,
      project.description ?? undefined,
      project.defaultPriority ?? undefined,
      project.clientId ?? undefined
    );
  }
}
