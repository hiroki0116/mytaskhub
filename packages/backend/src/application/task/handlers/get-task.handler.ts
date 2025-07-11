import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetTaskQuery } from "../queries/get-task.query";
import {
  ITaskRepository,
  TASK_REPOSITORY,
} from "src/domain/task/repositories/task.repository.interface";
import { TaskResponseDto } from "../dto/responses/task.response.dto";
import { Inject, NotFoundException } from "@nestjs/common";

@QueryHandler(GetTaskQuery)
export class GetTaskQueryHandler implements IQueryHandler<GetTaskQuery> {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: ITaskRepository
  ) {}

  async execute(query: GetTaskQuery): Promise<TaskResponseDto> {
    const { id, userId } = query;

    const task = await this.taskRepository.findById(id, userId);

    if (!task) {
      throw new NotFoundException("タスクが見つかりません");
    }

    return TaskResponseDto.fromEntity(task);
  }
}
