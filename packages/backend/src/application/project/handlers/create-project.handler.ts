import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import {
  IProjectRepository,
  PROJECT_REPOSITORY,
} from "../../../domain/project/repositories/project.repository.interface";
import { Inject } from "@nestjs/common";
import { ProjectResponseDto } from "../dto/responses/project.response.dto";
import { v4 as uuidv4 } from "uuid";
import { Project } from "../../../domain/project/entities/project.entity";
import { CreateProjectCommand } from "../commands/create-project.command";
import { ProjectStatusEnum } from "../../../domain/project/value-objects/project-status.value-object";
import { PriorityEnum } from "../../../domain/task/value-objects/task-priority.value-object";

@CommandHandler(CreateProjectCommand)
export class CreateProjectHandler implements ICommandHandler<CreateProjectCommand> {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository
  ) {}

  async execute(command: CreateProjectCommand): Promise<ProjectResponseDto> {
    const { userId, createProjectDto } = command;

    const project = await this.projectRepository.save(
      Project.create(
        uuidv4(),
        createProjectDto.name,
        createProjectDto.colorHex || "#000000",
        createProjectDto.status || ProjectStatusEnum.ACTIVE,
        createProjectDto.defaultPriority || PriorityEnum.MEDIUM,
        userId,
        createProjectDto.description,
        createProjectDto.clientId
      )
    );

    return ProjectResponseDto.fromEntity(project);
  }
}
