import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetProjectsQuery } from "../queries/get-projects.query";
import { Inject } from "@nestjs/common";
import {
  IProjectRepository,
  PROJECT_REPOSITORY,
} from "../../../domain/project/repositories/project.repository.interface";
import { ProjectResponseDto } from "../dto/responses/project.response.dto";

@QueryHandler(GetProjectsQuery)
export class GetProjectsQueryHandler implements IQueryHandler<GetProjectsQuery> {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository
  ) {}

  async execute(query: GetProjectsQuery): Promise<ProjectResponseDto[]> {
    const { userId } = query;

    const projects = await this.projectRepository.findManyByUserId(userId);

    return projects.map((project) => ProjectResponseDto.fromEntity(project));
  }
}
