import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateTaskCommand } from "../commands/create-task.command";
import {
  ITaskRepository,
  TASK_REPOSITORY,
} from "../../../domain/task/repositories/task.repository.interface";
import { Inject } from "@nestjs/common";
import { TaskResponseDto } from "../dto/responses/task.response.dto";
import { Task } from "../../../domain/task/entities/task.entity";
import { v4 as uuidv4 } from "uuid";

@CommandHandler(CreateTaskCommand)
export class CreateTaskHandler implements ICommandHandler<CreateTaskCommand> {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: ITaskRepository
  ) {}

  async execute(command: CreateTaskCommand): Promise<TaskResponseDto> {
    const { userId, createTaskDto } = command;

    const task = await this.taskRepository.save(
      Task.create(
        uuidv4(),
        createTaskDto.title,
        createTaskDto.status,
        createTaskDto.priority,
        createTaskDto.projectId,
        userId,
        createTaskDto.content,
        createTaskDto.deadline
      )
    );

    return TaskResponseDto.fromEntity(task);
  }
}
