import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetProjectQuery } from "../queries/get-project.query";
import {
  IProjectRepository,
  PROJECT_REPOSITORY,
} from "../../../domain/project/repositories/project.repository.interface";
import { Inject, NotFoundException } from "@nestjs/common";
import { ProjectResponseDto } from "../dto/responses/project.response.dto";

@QueryHandler(GetProjectQuery)
export class GetProjectQueryHandler implements IQueryHandler<GetProjectQuery> {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository
  ) {}

  async execute(query: GetProjectQuery) {
    const { projectId, userId } = query;

    const project = await this.projectRepository.findById(projectId, userId);

    if (!project) {
      throw new NotFoundException("Project not found");
    }

    return ProjectResponseDto.fromEntity(project);
  }
}
