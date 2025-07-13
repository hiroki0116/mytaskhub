import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateTaskCommand } from "../commands/update-task.command";
import {
  ITaskRepository,
  TASK_REPOSITORY,
} from "../../../domain/task/repositories/task.repository.interface";
import { TaskResponseDto } from "../dto/responses/task.response.dto";
import { Task } from "../../../domain/task/entities/task.entity";
import { Inject, NotFoundException } from "@nestjs/common";

@CommandHandler(UpdateTaskCommand)
export class UpdateTaskHandler implements ICommandHandler<UpdateTaskCommand> {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskReposiroty: ITaskRepository
  ) {}

  async execute(command: UpdateTaskCommand): Promise<TaskResponseDto> {
    const { id, userId, updateTaskDto } = command;

    const task = await this.taskReposiroty.findById(id, userId);

    if (!task) {
      throw new NotFoundException("Task not found");
    }

    const updatedTask = await this.taskReposiroty.save(
      Task.create(
        id,
        updateTaskDto.title,
        updateTaskDto.status,
        updateTaskDto.priority,
        updateTaskDto.projectId,
        userId,
        updateTaskDto.content,
        updateTaskDto.deadline
      )
    );

    return TaskResponseDto.fromEntity(updatedTask);
  }
}
