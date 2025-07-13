import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateProjectCommand } from "../commands/update-project.command";
import { ProjectResponseDto } from "../dto/responses/project.response.dto";
import { Inject, NotFoundException } from "@nestjs/common";
import {
  IProjectRepository,
  PROJECT_REPOSITORY,
} from "../../../domain/project/repositories/project.repository.interface";
import { Project } from "../../../domain/project/entities/project.entity";

@CommandHandler(UpdateProjectCommand)
export class UpdateProjectHandler implements ICommandHandler<UpdateProjectCommand> {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository
  ) {}

  async execute(command: UpdateProjectCommand): Promise<ProjectResponseDto> {
    const { userId, projectId, updateProjectDto } = command;

    const project = await this.projectRepository.findById(projectId, userId);

    if (!project) {
      throw new NotFoundException("Project not found");
    }

    const updatedProject = await this.projectRepository.save(
      Project.create(
        projectId,
        updateProjectDto.name,
        updateProjectDto.colorHex || project.colorHex,
        updateProjectDto.status || project.status,
        updateProjectDto.defaultPriority,
        userId,
        updateProjectDto.description,
        updateProjectDto.clientId
      )
    );

    return ProjectResponseDto.fromEntity(updatedProject);
  }
}
