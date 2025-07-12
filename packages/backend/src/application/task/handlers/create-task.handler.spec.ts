import { Test, TestingModule } from "@nestjs/testing";
import { CreateTaskCommand } from "../commands/create-task.command";
import {
  ITaskRepository,
  TASK_REPOSITORY,
} from "../../../domain/task/repositories/task.repository.interface";
import { CreateTaskHandler } from "./create-task.handler";
import { CreateTaskDto } from "../dto/create-task.dto";
import { Task } from "../../../domain/task/entities/task.entity";
import { TaskStatusEnum } from "../../../domain/task/value-objects/task-status.value-object";
import { PriorityEnum } from "../../../domain/task/value-objects/task-priority.value-object";
import { TaskResponseDto } from "../dto/responses/task.response.dto";

describe("CreateTaskHandler", () => {
  let handler: CreateTaskHandler;
  let taskRepository: jest.Mocked<ITaskRepository>;

  const mockCreateTaskDto: CreateTaskDto = {
    title: "テストタスク",
    status: TaskStatusEnum.TODO,
    priority: PriorityEnum.MEDIUM,
    projectId: "project-123",
    content: "テストタスクの内容",
    deadline: new Date("2024-12-31"),
  };

  const mockTask = Task.create(
    "task-123",
    mockCreateTaskDto.title,
    mockCreateTaskDto.status,
    mockCreateTaskDto.priority,
    mockCreateTaskDto.projectId,
    "user-123",
    mockCreateTaskDto.content,
    mockCreateTaskDto.deadline
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTaskHandler,
        {
          provide: TASK_REPOSITORY,
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<CreateTaskHandler>(CreateTaskHandler);
    taskRepository = module.get(TASK_REPOSITORY);
  });

  it("should be defined", () => {
    expect(handler).toBeDefined();
  });

  describe("execute", () => {
    it("should create and return a task successfully", async () => {
      const command = new CreateTaskCommand("user-123", mockCreateTaskDto);

      taskRepository.save.mockResolvedValue(mockTask);

      const result = await handler.execute(command);

      expect(result).toBeInstanceOf(TaskResponseDto);
      expect(result.id).toBe(mockTask.id);
      expect(result.title).toBe(mockTask.title);
      expect(result.status).toBe(mockTask.status);
      expect(result.priority).toBe(mockTask.priority);
      expect(result.projectId).toBe(mockTask.projectId);
      expect(result.userId).toBe(mockTask.userId);
      expect(result.content).toBe(mockTask.content);
      expect(result.deadline).toEqual(mockTask.deadline);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(taskRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          title: mockCreateTaskDto.title,
          status: mockCreateTaskDto.status,
          priority: mockCreateTaskDto.priority,
          projectId: mockCreateTaskDto.projectId,
          userId: "user-123",
          content: mockCreateTaskDto.content,
          deadline: mockCreateTaskDto.deadline,
        })
      );
    });

    it("should create task without optional fields", async () => {
      const createTaskDtoWithoutOptional: CreateTaskDto = {
        title: "シンプルタスク",
        status: TaskStatusEnum.TODO,
        priority: PriorityEnum.LOW,
        projectId: "project-456",
      };

      const simpleTask = Task.create(
        "task-456",
        createTaskDtoWithoutOptional.title,
        createTaskDtoWithoutOptional.status,
        createTaskDtoWithoutOptional.priority,
        createTaskDtoWithoutOptional.projectId,
        "user-123"
      );

      const command = new CreateTaskCommand("user-123", createTaskDtoWithoutOptional);

      taskRepository.save.mockResolvedValue(simpleTask);

      const result = await handler.execute(command);

      expect(result).toBeInstanceOf(TaskResponseDto);
      expect(result.title).toBe(createTaskDtoWithoutOptional.title);
      expect(result.content).toBeUndefined();
      expect(result.deadline).toBeUndefined();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(taskRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          title: createTaskDtoWithoutOptional.title,
          status: createTaskDtoWithoutOptional.status,
          priority: createTaskDtoWithoutOptional.priority,
          projectId: createTaskDtoWithoutOptional.projectId,
          userId: "user-123",
        })
      );
    });
  });
});
