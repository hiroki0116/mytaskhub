import { Body, Controller, Get, Post, Put, Delete, HttpStatus, Param } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { ApiResponse } from "../../common/interfaces/api-response.interface";
import { ApiResponseWrapper } from "../../common/responses/api-responses";
import { User } from "../../domain/user/entities/user.entity";
import { ProjectResponseDto } from "../../application/project/dto/responses/project.response.dto";
import { GetProjectsQuery } from "../../application/project/queries/get-projects.query";
import { GetProjectQuery } from "../../application/project/queries/get-project.query";
import { CreateProjectDto } from "../../application/project/dto/create-project.dto";
import { CreateProjectCommand } from "../../application/project/commands/create-project.command";
import { UpdateProjectDto } from "../../application/project/dto/update-project.dto";
import { UpdateProjectCommand } from "../../application/project/commands/update-project.command";
import { DeleteProjectCommand } from "../../application/project/commands/delete-project.command";

@ApiTags("プロジェクト")
@Controller("projects")
export class ProjectController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Get()
  async getProjects(@CurrentUser() user: User): Promise<ApiResponse<ProjectResponseDto[]>> {
    const projects = await this.queryBus.execute(new GetProjectsQuery(user.id));
    return ApiResponseWrapper.success(projects, "プロジェクト一覧を取得しました", HttpStatus.OK);
  }

  @Get(":id")
  async getProjectById(
    @Param("id") id: string,
    @CurrentUser() user: User
  ): Promise<ApiResponse<ProjectResponseDto>> {
    const project = await this.queryBus.execute(new GetProjectQuery(id, user.id));
    return ApiResponseWrapper.success(project, "プロジェクトを取得しました", HttpStatus.OK);
  }

  @Post()
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser() user: User
  ): Promise<ApiResponse<ProjectResponseDto>> {
    const project = await this.commandBus.execute(
      new CreateProjectCommand(user.id, createProjectDto)
    );
    return ApiResponseWrapper.success(project, "プロジェクトを作成しました", HttpStatus.CREATED);
  }

  @Put(":id")
  async updateProject(
    @Param("id") id: string,
    @CurrentUser() user: User,
    @Body() updateProjectDto: UpdateProjectDto
  ): Promise<ApiResponse<ProjectResponseDto>> {
    const updatedProject = await this.commandBus.execute(
      new UpdateProjectCommand(user.id, id, updateProjectDto)
    );
    return ApiResponseWrapper.success(updatedProject, "プロジェクトを更新しました", HttpStatus.OK);
  }

  @Delete(":id")
  async deleteProject(
    @Param("id") id: string,
    @CurrentUser() user: User
  ): Promise<ApiResponse<void>> {
    await this.commandBus.execute(new DeleteProjectCommand(user.id, id));
    return ApiResponseWrapper.success(null as any, "プロジェクトを削除しました", HttpStatus.OK);
  }
}
