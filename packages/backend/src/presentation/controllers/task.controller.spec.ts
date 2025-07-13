import { Test, TestingModule } from "@nestjs/testing";
import { TaskController } from "./task.controller";
import { User } from "../../domain/user/entities/user.entity";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateTaskDto } from "../../application/task/dto/create-task.dto";
import { UpdateTaskDto } from "../../application/task/dto/update-task.dto";
import { TaskResponseDto } from "../../application/task/dto/responses/task.response.dto";
import { TaskStatusEnum } from "../../domain/task/value-objects/task-status.value-object";
import { PriorityEnum } from "../../domain/task/value-objects/task-priority.value-object";
import { Task } from "../../domain/task/entities/task.entity";

describe("TaskController", () => {
  let controller: TaskController;
  let commandBus: jest.Mocked<CommandBus>;
  let queryBus: jest.Mocked<QueryBus>;

  const mockUser = User.create(
    "abcDEFGHIJKLmnopqrSTUVwxYZ123456789",
    "test@example.com",
    "TestUser",
    "a1b2c3d4e5f6g7h8i9j0k1l2m3n4",
    "https://example.com/avatar.jpg"
  );

  const mockTask = Task.create(
    "task1234567890123456789012345",
    "テストタスク",
    TaskStatusEnum.TODO,
    PriorityEnum.MEDIUM,
    "project1234567890123456789012345",
    "abcDEFGHIJKLmnopqrSTUVwxYZ123456789",
    "テストタスクの内容",
    new Date("2024-12-31")
  );

  const mockTaskResponse = TaskResponseDto.fromEntity(mockTask);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
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

    controller = module.get<TaskController>(TaskController);
    commandBus = module.get(CommandBus);
    queryBus = module.get(QueryBus);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("getTasks", () => {
    it("should return all tasks for user", async () => {
      const mockTasks = [mockTaskResponse];

      queryBus.execute.mockResolvedValue(mockTasks);

      const result = await controller.getTasks(mockUser);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect(result.data).toEqual(mockTasks);
      expect(result.message).toBe("タスク取得が完了しました");

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockUser.id,
        })
      );
    });

    it("should return empty array when no tasks exist", async () => {
      queryBus.execute.mockResolvedValue([]);

      const result = await controller.getTasks(mockUser);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect(result.data).toEqual([]);
      expect(result.message).toBe("タスク取得が完了しました");
    });
  });

  describe("getTaskById", () => {
    it("should return specific task by id", async () => {
      queryBus.execute.mockResolvedValue(mockTaskResponse);

      const result = await controller.getTaskById("task1234567890123456789012345", mockUser);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect(result.data).toEqual(mockTaskResponse);
      expect(result.message).toBe("タスク取得が完了しました");

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "task1234567890123456789012345",
          userId: mockUser.id,
        })
      );
    });
  });

  describe("createTask", () => {
    it("should create a new task", async () => {
      const createTaskDto: CreateTaskDto = {
        title: "新しいタスク",
        status: TaskStatusEnum.TODO,
        priority: PriorityEnum.HIGH,
        projectId: "project1234567890123456789012345",
        content: "新しいタスクの内容",
        deadline: new Date("2024-12-31"),
      };

      commandBus.execute.mockResolvedValue(mockTaskResponse);

      const result = await controller.createTask(createTaskDto, mockUser);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.status).toBe(201);
      expect(result.data).toEqual(mockTaskResponse);
      expect(result.message).toBe("タスク作成が完了しました");

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockUser.id,
          createTaskDto,
        })
      );
    });

    it("should create task without optional fields", async () => {
      const createTaskDto: CreateTaskDto = {
        title: "シンプルタスク",
        status: TaskStatusEnum.TODO,
        priority: PriorityEnum.LOW,
        projectId: "project456789012345678901234567890",
      };

      const simpleTask = Task.create(
        "task456789012345678901234567890",
        createTaskDto.title,
        createTaskDto.status,
        createTaskDto.priority,
        createTaskDto.projectId,
        mockUser.id
      );

      const simpleTaskResponse = TaskResponseDto.fromEntity(simpleTask);

      commandBus.execute.mockResolvedValue(simpleTaskResponse);

      const result = await controller.createTask(createTaskDto, mockUser);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.status).toBe(201);
      expect(result.data).toEqual(simpleTaskResponse);
      expect(result.message).toBe("タスク作成が完了しました");
    });
  });

  describe("updateTask", () => {
    it("should update an existing task", async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: "更新されたタスク",
        status: TaskStatusEnum.IN_PROGRESS,
        priority: PriorityEnum.HIGH,
        projectId: "project1234567890123456789012345",
        content: "更新されたタスクの内容",
        deadline: new Date("2024-12-31"),
      };

      const updatedTask = Task.create(
        "task1234567890123456789012345",
        updateTaskDto.title,
        updateTaskDto.status,
        updateTaskDto.priority,
        updateTaskDto.projectId,
        mockUser.id,
        updateTaskDto.content,
        updateTaskDto.deadline
      );

      const updatedTaskResponse = TaskResponseDto.fromEntity(updatedTask);

      commandBus.execute.mockResolvedValue(updatedTaskResponse);

      const result = await controller.updateTask(
        "task1234567890123456789012345",
        updateTaskDto,
        mockUser
      );

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect(result.data).toEqual(updatedTaskResponse);
      expect(result.message).toBe("タスク更新が完了しました");

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "task1234567890123456789012345",
          userId: mockUser.id,
          updateTaskDto,
        })
      );
    });

    it("should update task without optional fields", async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: "シンプル更新タスク",
        status: TaskStatusEnum.DONE,
        priority: PriorityEnum.LOW,
        projectId: "project456789012345678901234567890",
      };

      const simpleUpdatedTask = Task.create(
        "task456789012345678901234567890",
        updateTaskDto.title,
        updateTaskDto.status,
        updateTaskDto.priority,
        updateTaskDto.projectId,
        mockUser.id
      );

      const simpleUpdatedTaskResponse = TaskResponseDto.fromEntity(simpleUpdatedTask);

      commandBus.execute.mockResolvedValue(simpleUpdatedTaskResponse);

      const result = await controller.updateTask(
        "task456789012345678901234567890",
        updateTaskDto,
        mockUser
      );

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect(result.data).toEqual(simpleUpdatedTaskResponse);
      expect(result.message).toBe("タスク更新が完了しました");
    });
  });

  describe("deleteTask", () => {
    it("should delete an existing task", async () => {
      commandBus.execute.mockResolvedValue(undefined);

      const result = await controller.deleteTask("task1234567890123456789012345", mockUser);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect(result.data).toBeNull();
      expect(result.message).toBe("タスク削除が完了しました");

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "task1234567890123456789012345",
          userId: mockUser.id,
        })
      );
    });
  });
});
