import { Test, TestingModule } from "@nestjs/testing";
import { GetTaskQuery } from "../queries/get-task.query";
import {
  ITaskRepository,
  TASK_REPOSITORY,
} from "../../../domain/task/repositories/task.repository.interface";
import { GetTaskQueryHandler } from "./get-task.handler";
import { Task } from "../../../domain/task/entities/task.entity";
import { TaskStatusEnum } from "../../../domain/task/value-objects/task-status.value-object";
import { PriorityEnum } from "../../../domain/task/value-objects/task-priority.value-object";
import { TaskResponseDto } from "../dto/responses/task.response.dto";
import { NotFoundException } from "@nestjs/common";

describe("GetTaskQueryHandler", () => {
  let handler: GetTaskQueryHandler;
  let taskRepository: jest.Mocked<ITaskRepository>;

  const mockTask = Task.create(
    "task-123",
    "テストタスク",
    TaskStatusEnum.TODO,
    PriorityEnum.MEDIUM,
    "project-123",
    "user-123",
    "テストタスクの内容",
    new Date("2024-12-31")
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetTaskQueryHandler,
        {
          provide: TASK_REPOSITORY,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<GetTaskQueryHandler>(GetTaskQueryHandler);
    taskRepository = module.get(TASK_REPOSITORY);
  });

  it("should be defined", () => {
    expect(handler).toBeDefined();
  });

  describe("execute", () => {
    it("should return task when task exists", async () => {
      const query = new GetTaskQuery("task-123", "user-123");

      taskRepository.findById.mockResolvedValue(mockTask);

      const result = await handler.execute(query);

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
      expect(taskRepository.findById).toHaveBeenCalledWith("task-123", "user-123");
    });

    it("should throw NotFoundException when task does not exist", async () => {
      const query = new GetTaskQuery("non-existent-task", "user-123");

      taskRepository.findById.mockResolvedValue(null);

      await expect(handler.execute(query)).rejects.toThrow(
        new NotFoundException("タスクが見つかりません")
      );

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(taskRepository.findById).toHaveBeenCalledWith("non-existent-task", "user-123");
    });
  });
});
