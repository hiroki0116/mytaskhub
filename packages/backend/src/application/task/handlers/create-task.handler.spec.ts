import { Test, TestingModule } from "@nestjs/testing";
import { CreateTaskCommand } from "../commands/create-task.command";
import {
  ITaskRepository,
  TASK_REPOSITORY,
} from "../../../domain/task/repositories/task.repository.interface";
import { CreateTaskHandler } from "./create-task.handler";
import { Task } from "../../../domain/task/entities/task.entity";
import { TaskStatusEnum } from "../../../domain/task/value-objects/task-status.value-object";
import { PriorityEnum } from "../../../domain/task/value-objects/task-priority.value-object";
import { TaskResponseDto } from "../dto/responses/task.response.dto";
import { CreateTaskDto } from "../dto/create-task.dto";

describe("CreateTaskHandler", () => {
  let handler: CreateTaskHandler;
  let taskRepository: jest.Mocked<ITaskRepository>;

  const mockCreateTaskDto: CreateTaskDto = {
    title: "新しいタスク",
    status: TaskStatusEnum.TODO,
    priority: PriorityEnum.MEDIUM,
    projectId: "project1234567890123456789012345",
    content: "新しいタスクの内容",
    deadline: new Date("2024-12-31"),
  };

  const mockTask = Task.create(
    "task1234567890123456789012345",
    "新しいタスク",
    TaskStatusEnum.TODO,
    PriorityEnum.MEDIUM,
    "project1234567890123456789012345",
    "user1234567890123456789012345",
    "新しいタスクの内容",
    new Date("2024-12-31")
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
    it("should create a new task successfully", async () => {
      const command = new CreateTaskCommand("user1234567890123456789012345", mockCreateTaskDto);

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
          userId: "user1234567890123456789012345",
          content: mockCreateTaskDto.content,
          deadline: mockCreateTaskDto.deadline,
        })
      );
    });

    it("should create task without optional fields", async () => {
      const simpleCreateTaskDto: CreateTaskDto = {
        title: "シンプルタスク",
        status: TaskStatusEnum.TODO,
        priority: PriorityEnum.LOW,
        projectId: "project456789012345678901234567890",
      };

      const simpleTask = Task.create(
        "task456789012345678901234567890",
        simpleCreateTaskDto.title,
        simpleCreateTaskDto.status,
        simpleCreateTaskDto.priority,
        simpleCreateTaskDto.projectId,
        "user1234567890123456789012345"
      );

      const command = new CreateTaskCommand("user1234567890123456789012345", simpleCreateTaskDto);

      taskRepository.save.mockResolvedValue(simpleTask);

      const result = await handler.execute(command);

      expect(result).toBeInstanceOf(TaskResponseDto);
      expect(result.id).toBe(simpleTask.id);
      expect(result.title).toBe(simpleTask.title);
      expect(result.status).toBe(simpleTask.status);
      expect(result.priority).toBe(simpleTask.priority);
      expect(result.projectId).toBe(simpleTask.projectId);
      expect(result.userId).toBe(simpleTask.userId);
      expect(result.content).toBeUndefined();
      expect(result.deadline).toBeUndefined();
    });
  });
});
