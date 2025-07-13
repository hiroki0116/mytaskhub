import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import {
  PROJECT_REPOSITORY,
  IProjectRepository,
} from "../../../domain/project/repositories/project.repository.interface";
import { DeleteProjectCommand } from "../commands/delete-project.command";

@CommandHandler(DeleteProjectCommand)
export class DeleteProjectHandler implements ICommandHandler<DeleteProjectCommand> {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository
  ) {}

  async execute(command: DeleteProjectCommand): Promise<void> {
    const { userId, projectId } = command;

    await this.projectRepository.delete(projectId, userId);
  }
}
