import { Test, TestingModule } from "@nestjs/testing";
import { DeleteTaskCommand } from "../commands/delete-task.command";
import {
  ITaskRepository,
  TASK_REPOSITORY,
} from "../../../domain/task/repositories/task.repository.interface";
import { DeleteTaskHandler } from "./delete-task.handler";
import { Task } from "../../../domain/task/entities/task.entity";
import { TaskStatusEnum } from "../../../domain/task/value-objects/task-status.value-object";
import { PriorityEnum } from "../../../domain/task/value-objects/task-priority.value-object";
import { NotFoundException } from "@nestjs/common";

describe("DeleteTaskHandler", () => {
  let handler: DeleteTaskHandler;
  let taskRepository: jest.Mocked<ITaskRepository>;

  const mockTask = Task.create(
    "task1234567890123456789012345",
    "削除対象タスク",
    TaskStatusEnum.TODO,
    PriorityEnum.MEDIUM,
    "project1234567890123456789012345",
    "user1234567890123456789012345",
    "削除対象タスクの内容",
    new Date("2024-12-31")
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteTaskHandler,
        {
          provide: TASK_REPOSITORY,
          useValue: {
            findById: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<DeleteTaskHandler>(DeleteTaskHandler);
    taskRepository = module.get(TASK_REPOSITORY);
  });

  it("should be defined", () => {
    expect(handler).toBeDefined();
  });

  describe("execute", () => {
    it("should delete task successfully when task exists", async () => {
      const command = new DeleteTaskCommand(
        "task1234567890123456789012345",
        "user1234567890123456789012345"
      );

      taskRepository.findById.mockResolvedValue(mockTask);
      taskRepository.delete.mockResolvedValue(undefined);

      await expect(handler.execute(command)).resolves.toBeUndefined();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(taskRepository.findById).toHaveBeenCalledWith(
        "task1234567890123456789012345",
        "user1234567890123456789012345"
      );
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(taskRepository.delete).toHaveBeenCalledWith(
        "task1234567890123456789012345",
        "user1234567890123456789012345"
      );
    });

    it("should throw NotFoundException when task does not exist", async () => {
      const command = new DeleteTaskCommand(
        "nonexistenttask123456789012345",
        "user1234567890123456789012345"
      );

      taskRepository.findById.mockResolvedValue(null);

      await expect(handler.execute(command)).rejects.toThrow(
        new NotFoundException("タスクが見つかりません")
      );

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(taskRepository.findById).toHaveBeenCalledWith(
        "nonexistenttask123456789012345",
        "user1234567890123456789012345"
      );
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(taskRepository.delete).not.toHaveBeenCalled();
    });

    it("should throw NotFoundException when task belongs to different user", async () => {
      const command = new DeleteTaskCommand(
        "task1234567890123456789012345",
        "differentuser123456789012345"
      );

      taskRepository.findById.mockResolvedValue(null);

      await expect(handler.execute(command)).rejects.toThrow(
        new NotFoundException("タスクが見つかりません")
      );

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(taskRepository.findById).toHaveBeenCalledWith(
        "task1234567890123456789012345",
        "differentuser123456789012345"
      );
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(taskRepository.delete).not.toHaveBeenCalled();
    });
  });
});
