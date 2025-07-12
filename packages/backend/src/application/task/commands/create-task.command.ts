import { CreateTaskDto } from "../dto/create-task.dto";

export class CreateTaskCommand {
  constructor(
    public readonly userId: string,
    public readonly createTaskDto: CreateTaskDto
  ) {}
}
