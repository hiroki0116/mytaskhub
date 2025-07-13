import { Test, TestingModule } from "@nestjs/testing";
import { ProjectController } from "./project.controller";
import { User } from "../../domain/user/entities/user.entity";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateProjectDto } from "../../application/project/dto/create-project.dto";
import { UpdateProjectDto } from "../../application/project/dto/update-project.dto";
import { ProjectResponseDto } from "../../application/project/dto/responses/project.response.dto";
import { Project } from "../../domain/project/entities/project.entity";
import { ProjectStatusEnum } from "../../domain/project/value-objects/project-status.value-object";
import { PriorityEnum } from "../../domain/task/value-objects/task-priority.value-object";

describe("ProjectController", () => {
  let controller: ProjectController;
  let commandBus: jest.Mocked<CommandBus>;
  let queryBus: jest.Mocked<QueryBus>;

  const mockUser = User.create(
    "abcDEFGHIJKLmnopqrSTUVwxYZ123456789",
    "test@example.com",
    "TestUser",
    "a1b2c3d4e5f6g7h8i9j0k1l2m3n4",
    "https://example.com/avatar.jpg"
  );

  const mockProject = Project.create(
    "project_123_abcdefghijklmnopqrstuvwxyz",
    "テストプロジェクト",
    "#FF5733",
    ProjectStatusEnum.ACTIVE,
    PriorityEnum.MEDIUM,
    mockUser.id,
    "テストプロジェクトの説明",
    "client-123"
  );

  const mockProjectResponse = ProjectResponseDto.fromEntity(mockProject);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: QueryBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProjectController>(ProjectController);
    commandBus = module.get(CommandBus);
    queryBus = module.get(QueryBus);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("getProjects", () => {
    it("should return projects list", async () => {
      const mockProjects = [mockProjectResponse];
      queryBus.execute.mockResolvedValue(mockProjects);

      const result = await controller.getProjects(mockUser);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect(result.data).toEqual(mockProjects);
      expect(result.message).toBe("プロジェクト一覧を取得しました");
    });

    it("should return empty array when no projects exist", async () => {
      const mockProjects: ProjectResponseDto[] = [];
      queryBus.execute.mockResolvedValue(mockProjects);

      const result = await controller.getProjects(mockUser);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect(result.data).toEqual(mockProjects);
      expect(result.message).toBe("プロジェクト一覧を取得しました");
    });
  });

  describe("getProjectById", () => {
    it("should return a specific project", async () => {
      const projectId = "project_123_abcdefghijklmnopqrstuvwxyz";
      queryBus.execute.mockResolvedValue(mockProjectResponse);

      const result = await controller.getProjectById(projectId, mockUser);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect(result.data).toEqual(mockProjectResponse);
      expect(result.message).toBe("プロジェクトを取得しました");
    });
  });

  describe("createProject", () => {
    it("should create a new project", async () => {
      const createProjectDto: CreateProjectDto = {
        name: "新しいプロジェクト",
        colorHex: "#FF5733",
        status: ProjectStatusEnum.ACTIVE,
        defaultPriority: PriorityEnum.MEDIUM,
        description: "新しいプロジェクトの説明",
        clientId: "client-456",
      };

      commandBus.execute.mockResolvedValue(mockProjectResponse);

      const result = await controller.createProject(createProjectDto, mockUser);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.status).toBe(201);
      expect(result.data).toEqual(mockProjectResponse);
      expect(result.message).toBe("プロジェクトを作成しました");
    });

    it("should create a project with minimal data", async () => {
      const createProjectDto: CreateProjectDto = {
        name: "シンプルプロジェクト",
        defaultPriority: PriorityEnum.LOW,
      };

      const simpleProject = Project.create(
        "project_simple_abcdefghijklmnopqrstuvwxyz",
        "シンプルプロジェクト",
        "#000000",
        ProjectStatusEnum.ACTIVE,
        PriorityEnum.LOW,
        mockUser.id
      );
      const simpleProjectResponse = ProjectResponseDto.fromEntity(simpleProject);

      commandBus.execute.mockResolvedValue(simpleProjectResponse);

      const result = await controller.createProject(createProjectDto, mockUser);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.status).toBe(201);
      expect(result.data).toEqual(simpleProjectResponse);
      expect(result.message).toBe("プロジェクトを作成しました");
    });
  });

  describe("updateProject", () => {
    it("should update an existing project", async () => {
      const projectId = "project_123_abcdefghijklmnopqrstuvwxyz";
      const updateProjectDto: UpdateProjectDto = {
        name: "更新されたプロジェクト",
        colorHex: "#33FF57",
        status: ProjectStatusEnum.COMPLETED,
        defaultPriority: PriorityEnum.HIGH,
        description: "更新されたプロジェクトの説明",
        clientId: "client-789",
      };

      const updatedProject = Project.create(
        projectId,
        "更新されたプロジェクト",
        "#33FF57",
        ProjectStatusEnum.COMPLETED,
        PriorityEnum.HIGH,
        mockUser.id,
        "更新されたプロジェクトの説明",
        "client-789"
      );
      const updatedProjectResponse = ProjectResponseDto.fromEntity(updatedProject);

      commandBus.execute.mockResolvedValue(updatedProjectResponse);

      const result = await controller.updateProject(projectId, mockUser, updateProjectDto);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect(result.data).toEqual(updatedProjectResponse);
      expect(result.message).toBe("プロジェクトを更新しました");
    });

    it("should update project with partial data", async () => {
      const projectId = "project_123_abcdefghijklmnopqrstuvwxyz";
      const updateProjectDto: UpdateProjectDto = {
        name: "部分更新プロジェクト",
        defaultPriority: PriorityEnum.URGENT,
      };

      const partiallyUpdatedProject = Project.create(
        projectId,
        "部分更新プロジェクト",
        "#FF5733",
        ProjectStatusEnum.ACTIVE,
        PriorityEnum.URGENT,
        mockUser.id,
        "テストプロジェクトの説明",
        "client-123"
      );
      const partiallyUpdatedProjectResponse =
        ProjectResponseDto.fromEntity(partiallyUpdatedProject);

      commandBus.execute.mockResolvedValue(partiallyUpdatedProjectResponse);

      const result = await controller.updateProject(projectId, mockUser, updateProjectDto);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect(result.data).toEqual(partiallyUpdatedProjectResponse);
      expect(result.message).toBe("プロジェクトを更新しました");
    });
  });

  describe("deleteProject", () => {
    it("should delete a project", async () => {
      const projectId = "project_123_abcdefghijklmnopqrstuvwxyz";
      commandBus.execute.mockResolvedValue(undefined);

      const result = await controller.deleteProject(projectId, mockUser);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect(result.data).toBeNull();
      expect(result.message).toBe("プロジェクトを削除しました");
    });
  });
});
