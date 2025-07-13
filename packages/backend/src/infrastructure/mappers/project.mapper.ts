import { Injectable } from "@nestjs/common";
import { Project as PrismaProject, ProjectStatus } from "@prisma/client";
import { Project } from "../../domain/project/entities/project.entity";
import { ProjectStatusEnum } from "../../domain/project/value-objects/project-status.value-object";
import { PriorityEnum } from "../../domain/task/value-objects/task-priority.value-object";

@Injectable()
export class ProjectMapper {
  toDomain(prismaProject: PrismaProject): Project {
    return Project.create(
      prismaProject.id,
      prismaProject.name,
      prismaProject.colorHex,
      prismaProject.status as ProjectStatusEnum,
      prismaProject.defaultPriority as PriorityEnum,
      prismaProject.userId,
      prismaProject.description || undefined,
      prismaProject.clientId || undefined
    );
  }

  toPersistence(project: Project): Omit<PrismaProject, "createdAt" | "updatedAt"> {
    return {
      id: project.id,
      name: project.name,
      colorHex: project.colorHex,
      status: project.status as ProjectStatus,
      defaultPriority: project.defaultPriority,
      userId: project.userId,
      description: project.description,
      clientId: project.clientId,
    };
  }
}
