import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteTaskCommand } from "../commands/delete-task.command";
import { Inject, NotFoundException } from "@nestjs/common";
import {
  TASK_REPOSITORY,
  ITaskRepository,
} from "../../../domain/task/repositories/task.repository.interface";

@CommandHandler(DeleteTaskCommand)
export class DeleteTaskHandler implements ICommandHandler<DeleteTaskCommand> {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: ITaskRepository
  ) {}

  async execute(command: DeleteTaskCommand): Promise<void> {
    const { id, userId } = command;

    // 削除前にタスクの存在確認
    const existingTask = await this.taskRepository.findById(id, userId);
    if (!existingTask) {
      throw new NotFoundException(`タスクが見つかりません`);
    }

    await this.taskRepository.delete(id, userId);
  }
}
