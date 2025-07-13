import { Test, TestingModule } from "@nestjs/testing";
import { UpdateTaskCommand } from "../commands/update-task.command";
import {
  ITaskRepository,
  TASK_REPOSITORY,
} from "../../../domain/task/repositories/task.repository.interface";
import { UpdateTaskHandler } from "./update-task.handler";
import { Task } from "../../../domain/task/entities/task.entity";
import { TaskStatusEnum } from "../../../domain/task/value-objects/task-status.value-object";
import { PriorityEnum } from "../../../domain/task/value-objects/task-priority.value-object";
import { TaskResponseDto } from "../dto/responses/task.response.dto";
import { UpdateTaskDto } from "../dto/update-task.dto";
import { NotFoundException } from "@nestjs/common";

describe("UpdateTaskHandler", () => {
  let handler: UpdateTaskHandler;
  let taskRepository: jest.Mocked<ITaskRepository>;

  const mockUpdateTaskDto: UpdateTaskDto = {
    title: "更新されたタスク",
    status: TaskStatusEnum.IN_PROGRESS,
    priority: PriorityEnum.HIGH,
    projectId: "project1234567890123456789012345",
    content: "更新されたタスクの内容",
    deadline: new Date("2024-12-31"),
  };

  const mockTask = Task.create(
    "task1234567890123456789012345",
    "更新されたタスク",
    TaskStatusEnum.IN_PROGRESS,
    PriorityEnum.HIGH,
    "project1234567890123456789012345",
    "user1234567890123456789012345",
    "更新されたタスクの内容",
    new Date("2024-12-31")
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateTaskHandler,
        {
          provide: TASK_REPOSITORY,
          useValue: {
            findById: jest.fn(),
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
    it("should update task successfully when task exists", async () => {
      const command = new UpdateTaskCommand(
        "task1234567890123456789012345",
        "user1234567890123456789012345",
        mockUpdateTaskDto
      );

      taskRepository.findById.mockResolvedValue(mockTask);
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
      expect(taskRepository.findById).toHaveBeenCalledWith(
        "task1234567890123456789012345",
        "user1234567890123456789012345"
      );
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(taskRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "task1234567890123456789012345",
          title: mockUpdateTaskDto.title,
          status: mockUpdateTaskDto.status,
          priority: mockUpdateTaskDto.priority,
          projectId: mockUpdateTaskDto.projectId,
          userId: "user1234567890123456789012345",
          content: mockUpdateTaskDto.content,
          deadline: mockUpdateTaskDto.deadline,
        })
      );
    });

    it("should throw NotFoundException when task does not exist", async () => {
      const command = new UpdateTaskCommand(
        "nonexistenttask123456789012345",
        "user1234567890123456789012345",
        mockUpdateTaskDto
      );

      taskRepository.findById.mockResolvedValue(null);

      await expect(handler.execute(command)).rejects.toThrow(
        new NotFoundException("Task not found")
      );

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(taskRepository.findById).toHaveBeenCalledWith(
        "nonexistenttask123456789012345",
        "user1234567890123456789012345"
      );
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(taskRepository.save).not.toHaveBeenCalled();
    });
  });
});
