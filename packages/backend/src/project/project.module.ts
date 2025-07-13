import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { PrismaModule } from "../prisma/prisma.module";
import { PrismaProjectRepository } from "../infrastructure/repositories/prisma-project.repository";
import { PROJECT_REPOSITORY } from "../domain/project/repositories/project.repository.interface";
import { ProjectController } from "../presentation/controllers/project.controller";
import { DeleteProjectHandler } from "../application/project/handlers/delete-project.handler";
import { GetProjectsQueryHandler } from "../application/project/handlers/get-projects.handler";
import { UpdateProjectHandler } from "../application/project/handlers/update-project.handler";
import { ProjectMapper } from "../infrastructure/mappers/project.mapper";
import { CreateProjectHandler } from "../application/project/handlers/create-project.handler";
import { GetProjectQueryHandler } from "../application/project/handlers/get-project.handler";

@Module({
  imports: [CqrsModule, PrismaModule],
  controllers: [ProjectController],
  providers: [
    ProjectMapper,
    {
      provide: PROJECT_REPOSITORY,
      useClass: PrismaProjectRepository,
    },
    CreateProjectHandler,
    GetProjectQueryHandler,
    GetProjectsQueryHandler,
    UpdateProjectHandler,
    DeleteProjectHandler,
  ],
  exports: [PROJECT_REPOSITORY],
})
export class ProjectModule {}
