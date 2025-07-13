import { UpdateProjectDto } from "../dto/update-project.dto";

export class UpdateProjectCommand {
  constructor(
    public readonly userId: string,
    public readonly projectId: string,
    public readonly updateProjectDto: UpdateProjectDto
  ) {}
}
