import { Controller, Get, Post, Put, Delete, HttpStatus, Param, Body } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiTags } from "@nestjs/swagger";
import { TaskResponseDto } from "src/application/task/dto/responses/task.response.dto";
import { ApiResponse } from "../../common/interfaces/api-response.interface";
import { ApiResponseWrapper } from "../../common/responses/api-responses";
import { CreateTaskDto } from "../../application/task/dto/create-task.dto";
import { UpdateTaskDto } from "../../application/task/dto/update-task.dto";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { User } from "../../domain/user/entities/user.entity";
import { GetTasksQuery } from "../../application/task/queries/get-tasks.query";
import { GetTaskQuery } from "../../application/task/queries/get-task.query";
import { CreateTaskCommand } from "../../application/task/commands/create-task.command";
import { UpdateTaskCommand } from "../../application/task/commands/update-task.command";
import { DeleteTaskCommand } from "../../application/task/commands/delete-task.command";

@ApiTags("タスク")
@Controller("tasks")
export class TaskController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Get()
  async getTasks(@CurrentUser() user: User): Promise<ApiResponse<TaskResponseDto[]>> {
    const tasks = await this.queryBus.execute<GetTasksQuery, TaskResponseDto[]>(
      new GetTasksQuery(user.id)
    );
    return ApiResponseWrapper.success(tasks, "タスク取得が完了しました", HttpStatus.OK);
  }

  @Get(":id")
  async getTaskById(
    @Param("id") id: string,
    @CurrentUser() user: User
  ): Promise<ApiResponse<TaskResponseDto>> {
    const task = await this.queryBus.execute<GetTasksQuery, TaskResponseDto>(
      new GetTaskQuery(id, user.id)
    );
    return ApiResponseWrapper.success(task, "タスク取得が完了しました", HttpStatus.OK);
  }

  @Post()
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() user: User
  ): Promise<ApiResponse<TaskResponseDto>> {
    const task = await this.commandBus.execute<CreateTaskCommand, TaskResponseDto>(
      new CreateTaskCommand(user.id, createTaskDto)
    );
    return ApiResponseWrapper.success(task, "タスク作成が完了しました", HttpStatus.CREATED);
  }

  @Put(":id")
  async updateTask(
    @Param("id") id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: User
  ): Promise<ApiResponse<TaskResponseDto>> {
    const task = await this.commandBus.execute<UpdateTaskCommand, TaskResponseDto>(
      new UpdateTaskCommand(id, user.id, updateTaskDto)
    );
    return ApiResponseWrapper.success(task, "タスク更新が完了しました", HttpStatus.OK);
  }

  @Delete(":id")
  async deleteTask(@Param("id") id: string, @CurrentUser() user: User): Promise<ApiResponse<void>> {
    await this.commandBus.execute(new DeleteTaskCommand(id, user.id));
    return ApiResponseWrapper.success(null as any, "タスク削除が完了しました", HttpStatus.OK);
  }
}
