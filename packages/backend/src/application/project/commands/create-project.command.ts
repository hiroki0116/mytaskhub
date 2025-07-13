import { CreateProjectDto } from "../dto/create-project.dto";

export class CreateProjectCommand {
  constructor(
    public readonly userId: string,
    public readonly createProjectDto: CreateProjectDto
  ) {}
}
