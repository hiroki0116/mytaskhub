import { Test, TestingModule } from "@nestjs/testing";
import { GetTasksQuery } from "../queries/get-tasks.query";
import {
  ITaskRepository,
  TASK_REPOSITORY,
} from "../../../domain/task/repositories/task.repository.interface";
import { GetTasksQueryHandler } from "./get-tasks.handler";
import { Task } from "../../../domain/task/entities/task.entity";
import { TaskStatusEnum } from "../../../domain/task/value-objects/task-status.value-object";
import { PriorityEnum } from "../../../domain/task/value-objects/task-priority.value-object";
import { TaskResponseDto } from "../dto/responses/task.response.dto";

describe("GetTasksQueryHandler", () => {
  let handler: GetTasksQueryHandler;
  let taskRepository: jest.Mocked<ITaskRepository>;

  const mockTasks = [
    Task.create(
      "task1234567890123456789012345",
      "テストタスク1",
      TaskStatusEnum.TODO,
      PriorityEnum.HIGH,
      "project1234567890123456789012345",
      "user1234567890123456789012345",
      "テストタスク1の内容",
      new Date("2024-12-31")
    ),
    Task.create(
      "task2345678901234567890123456",
      "テストタスク2",
      TaskStatusEnum.IN_PROGRESS,
      PriorityEnum.MEDIUM,
      "project1234567890123456789012345",
      "user1234567890123456789012345",
      "テストタスク2の内容",
      new Date("2024-12-30")
    ),
    Task.create(
      "task3456789012345678901234567",
      "テストタスク3",
      TaskStatusEnum.DONE,
      PriorityEnum.LOW,
      "project456789012345678901234567890",
      "user1234567890123456789012345"
    ),
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetTasksQueryHandler,
        {
          provide: TASK_REPOSITORY,
          useValue: {
            findManyByUserId: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<GetTasksQueryHandler>(GetTasksQueryHandler);
    taskRepository = module.get(TASK_REPOSITORY);
  });

  it("should be defined", () => {
    expect(handler).toBeDefined();
  });

  describe("execute", () => {
    it("should return tasks when tasks exist", async () => {
      const query = new GetTasksQuery("user1234567890123456789012345");

      taskRepository.findManyByUserId.mockResolvedValue(mockTasks);

      const result = await handler.execute(query);

      expect(result).toHaveLength(3);
      expect(result[0]).toBeInstanceOf(TaskResponseDto);
      expect(result[1]).toBeInstanceOf(TaskResponseDto);
      expect(result[2]).toBeInstanceOf(TaskResponseDto);

      expect(result[0].id).toBe("task1234567890123456789012345");
      expect(result[0].title).toBe("テストタスク1");
      expect(result[0].status).toBe(TaskStatusEnum.TODO);
      expect(result[0].priority).toBe(PriorityEnum.HIGH);

      expect(result[1].id).toBe("task2345678901234567890123456");
      expect(result[1].title).toBe("テストタスク2");
      expect(result[1].status).toBe(TaskStatusEnum.IN_PROGRESS);
      expect(result[1].priority).toBe(PriorityEnum.MEDIUM);

      expect(result[2].id).toBe("task3456789012345678901234567");
      expect(result[2].title).toBe("テストタスク3");
      expect(result[2].status).toBe(TaskStatusEnum.DONE);
      expect(result[2].priority).toBe(PriorityEnum.LOW);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(taskRepository.findManyByUserId).toHaveBeenCalledWith("user1234567890123456789012345");
    });

    it("should return empty array when no tasks exist", async () => {
      const query = new GetTasksQuery("user1234567890123456789012345");

      taskRepository.findManyByUserId.mockResolvedValue([]);

      const result = await handler.execute(query);

      expect(result).toHaveLength(0);
      expect(Array.isArray(result)).toBe(true);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(taskRepository.findManyByUserId).toHaveBeenCalledWith("user1234567890123456789012345");
    });
  });
});
