import { Test, TestingModule } from "@nestjs/testing";
import { UpdateTaskCommand } from "../commands/update-task.command";
import {
  ITaskRepository,
  TASK_REPOSITORY,
} from "../../../domain/task/repositories/task.repository.interface";
import { UpdateTaskHandler } from "./update-task.handler";
import { UpdateTaskDto } from "../dto/update-task.dto";
import { Task } from "../../../domain/task/entities/task.entity";
import { TaskStatusEnum } from "../../../domain/task/value-objects/task-status.value-object";
import { PriorityEnum } from "../../../domain/task/value-objects/task-priority.value-object";
import { TaskResponseDto } from "../dto/responses/task.response.dto";

describe("UpdateTaskHandler", () => {
  let handler: UpdateTaskHandler;
  let taskRepository: jest.Mocked<ITaskRepository>;

  const mockUpdateTaskDto: UpdateTaskDto = {
    title: "更新されたタスク",
    status: TaskStatusEnum.IN_PROGRESS,
    priority: PriorityEnum.HIGH,
    projectId: "project-123",
    content: "更新されたタスクの内容",
    deadline: new Date("2024-12-31"),
  };

  const mockUpdatedTask = Task.create(
    "task-123",
    mockUpdateTaskDto.title,
    mockUpdateTaskDto.status,
    mockUpdateTaskDto.priority,
    mockUpdateTaskDto.projectId,
    "user-123",
    mockUpdateTaskDto.content,
    mockUpdateTaskDto.deadline
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateTaskHandler,
        {
          provide: TASK_REPOSITORY,
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<UpdateTaskHandler>(UpdateTaskHandler);
    taskRepository = module.get(TASK_REPOSITORY);
  });

  it("should be defined", () => {
    expect(handler).toBeDefined();
  });

  describe("execute", () => {
    it("should update and return a task successfully", async () => {
      const command = new UpdateTaskCommand("task-123", "user-123", mockUpdateTaskDto);

      taskRepository.save.mockResolvedValue(mockUpdatedTask);

      const result = await handler.execute(command);

      expect(result).toBeInstanceOf(TaskResponseDto);
      expect(result.id).toBe(mockUpdatedTask.id);
      expect(result.title).toBe(mockUpdatedTask.title);
      expect(result.status).toBe(mockUpdatedTask.status);
      expect(result.priority).toBe(mockUpdatedTask.priority);
      expect(result.projectId).toBe(mockUpdatedTask.projectId);
      expect(result.userId).toBe(mockUpdatedTask.userId);
      expect(result.content).toBe(mockUpdatedTask.content);
      expect(result.deadline).toEqual(mockUpdatedTask.deadline);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(taskRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "task-123",
          title: mockUpdateTaskDto.title,
          status: mockUpdateTaskDto.status,
          priority: mockUpdateTaskDto.priority,
          projectId: mockUpdateTaskDto.projectId,
          userId: "user-123",
          content: mockUpdateTaskDto.content,
          deadline: mockUpdateTaskDto.deadline,
        })
      );
    });

    it("should update task without optional fields", async () => {
      const updateTaskDtoWithoutOptional: UpdateTaskDto = {
        title: "シンプル更新タスク",
        status: TaskStatusEnum.DONE,
        priority: PriorityEnum.LOW,
        projectId: "project-456",
      };

      const simpleUpdatedTask = Task.create(
        "task-456",
        updateTaskDtoWithoutOptional.title,
        updateTaskDtoWithoutOptional.status,
        updateTaskDtoWithoutOptional.priority,
        updateTaskDtoWithoutOptional.projectId,
        "user-123"
      );

      const command = new UpdateTaskCommand("task-456", "user-123", updateTaskDtoWithoutOptional);

      taskRepository.save.mockResolvedValue(simpleUpdatedTask);

      const result = await handler.execute(command);

      expect(result).toBeInstanceOf(TaskResponseDto);
      expect(result.title).toBe(updateTaskDtoWithoutOptional.title);
      expect(result.status).toBe(updateTaskDtoWithoutOptional.status);
      expect(result.priority).toBe(updateTaskDtoWithoutOptional.priority);
      expect(result.projectId).toBe(updateTaskDtoWithoutOptional.projectId);
      expect(result.content).toBeUndefined();
      expect(result.deadline).toBeUndefined();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(taskRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "task-456",
          title: updateTaskDtoWithoutOptional.title,
          status: updateTaskDtoWithoutOptional.status,
          priority: updateTaskDtoWithoutOptional.priority,
          projectId: updateTaskDtoWithoutOptional.projectId,
          userId: "user-123",
        })
      );
    });
  });
});
