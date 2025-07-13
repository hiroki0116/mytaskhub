import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetTasksByProjectQuery } from "../queries/get-tasks-by-project.query";
import {
  ITaskRepository,
  TASK_REPOSITORY,
} from "../../../domain/task/repositories/task.repository.interface";
import { TaskResponseDto } from "../dto/responses/task.response.dto";
import { Inject } from "@nestjs/common";

@QueryHandler(GetTasksByProjectQuery)
export class GetTasksByProjectHandler implements IQueryHandler<GetTasksByProjectQuery> {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: ITaskRepository
  ) {}

  async execute(query: GetTasksByProjectQuery): Promise<TaskResponseDto[]> {
    const { projectId, userId } = query;

    const tasks = await this.taskRepository.findManyByProjectId(projectId, userId);

    return tasks.map((task) => TaskResponseDto.fromEntity(task));
  }
}
