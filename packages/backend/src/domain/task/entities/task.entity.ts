import { AggregateRoot } from "@nestjs/cqrs";
import { TaskId } from "../value-objects/task-id.value-object";
import { TaskTitle } from "../value-objects/task-title.value-object";
import { TaskStatus, TaskStatusEnum } from "../value-objects/task-status.value-object";
import { TaskPriority, PriorityEnum } from "../value-objects/task-priority.value-object";
import { UserId } from "../../../domain/user/value-objects/user-id.value-object";
import { TaskContent } from "../value-objects/task-content.value-object";

export class Task extends AggregateRoot {
  constructor(
    private readonly _id: TaskId,
    private readonly _title: TaskTitle,
    private readonly _status: TaskStatus,
    private readonly _priority: TaskPriority,
    private readonly _projectId: string, //TODO: ProjectIdを追加
    private readonly _userId: UserId,
    private readonly _content?: TaskContent,
    private readonly _deadline?: Date,
    private readonly _completedAt?: Date,
    private readonly _createdAt: Date = new Date(),
    private readonly _updatedAt: Date = new Date()
  ) {
    super();
  }

  get id(): string {
    return this._id.getValue();
  }

  get title(): string {
    return this._title.getValue();
  }

  get status(): TaskStatusEnum {
    return this._status.getValue();
  }

  get priority(): PriorityEnum {
    return this._priority.getValue();
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get userId(): string {
    return this._userId.getValue();
  }

  get projectId(): string {
    return this._projectId;
  }

  get content(): string | null {
    return this._content ? this._content.getValue() : null;
  }

  get deadline(): Date | null {
    return this._deadline ? this._deadline : null;
  }

  get completedAt(): Date | null {
    return this._completedAt ? this._completedAt : null;
  }

  // Factory method
  public static create(
    id: string,
    title: string,
    status: TaskStatusEnum,
    priority: PriorityEnum,
    projectId: string,
    userId: string,
    content?: string,
    deadline?: Date,
    completedAt?: Date
  ) {
    return new Task(
      new TaskId(id),
      new TaskTitle(title),
      new TaskStatus(status),
      new TaskPriority(priority),
      projectId,
      new UserId(userId),
      content ? TaskContent.create(content) || undefined : undefined,
      deadline,
      completedAt
    );
  }

  toJSON() {
    return {
      id: this._id,
      title: this._title,
      status: this._status,
      priority: this._priority,
      projectId: this._projectId,
      userId: this._userId,
      content: this._content,
      deadline: this._deadline,
      completedAt: this._completedAt,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
