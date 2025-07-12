import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetTasksQuery } from "../queries/get-tasks.query";
import {
  ITaskRepository,
  TASK_REPOSITORY,
} from "../../../domain/task/repositories/task.repository.interface";
import { Inject } from "@nestjs/common";
import { TaskResponseDto } from "../dto/responses/task.response.dto";

@QueryHandler(GetTasksQuery)
export class GetTasksQueryHandler implements IQueryHandler<GetTasksQuery> {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: ITaskRepository
  ) {}

  async execute(query: GetTasksQuery): Promise<TaskResponseDto[]> {
    const { userId } = query;

    const tasks = await this.taskRepository.findManyByUserId(userId);

    return tasks.map((task) => TaskResponseDto.fromEntity(task));
  }
}
