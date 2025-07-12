import { Module } from "@nestjs/common";
import { TaskMapper } from "../infrastructure/mappers/task.mapper";
import { CqrsModule } from "@nestjs/cqrs";
import { PrismaModule } from "../prisma/prisma.module";
import { PrismaTaskReposiroty } from "../infrastructure/repositories/prisma-task.repository";
import { TASK_REPOSITORY } from "../domain/task/repositories/task.repository.interface";
import { TaskController } from "../presentation/controllers/task.controller";
import { CreateTaskHandler } from "../application/task/handlers/create-task.handler";
import { GetTaskQueryHandler } from "../application/task/handlers/get-task.handler";
import { GetTasksQueryHandler } from "../application/task/handlers/get-tasks.handler";
import { UpdateTaskHandler } from "../application/task/handlers/update-task.handler";
import { DeleteTaskHandler } from "../application/task/handlers/delete-task.handler";

@Module({
  imports: [CqrsModule, PrismaModule],
  controllers: [TaskController],
  providers: [
    TaskMapper,
    {
      provide: TASK_REPOSITORY,
      useClass: PrismaTaskReposiroty,
    },
    CreateTaskHandler,
    GetTaskQueryHandler,
    GetTasksQueryHandler,
    UpdateTaskHandler,
    DeleteTaskHandler,
  ],
  exports: [TASK_REPOSITORY],
})
export class TaskModule {}
