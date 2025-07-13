import { UserId } from "../../../domain/user/value-objects/user-id.value-object";
import { AggregateRoot } from "@nestjs/cqrs";
import { ProjectId } from "../value-objects/project-id.value-object";
import { ProjectName } from "../value-objects/project-name.value-object";
import { ProjectDescription } from "../value-objects/project-description.value-object";
import { ProjectColorHex } from "../value-objects/project-colorhex.value-object";
import { ProjectDefaultPriority } from "../value-objects/project-default-priority.value-object";
import { ProjectStatus, ProjectStatusEnum } from "../value-objects/project-status.value-object";
import { PriorityEnum } from "../../../domain/task/value-objects/task-priority.value-object";

export class Project extends AggregateRoot {
  constructor(
    private readonly _id: ProjectId,
    private readonly _name: ProjectName,
    private readonly _colorHex: ProjectColorHex,
    private readonly _status: ProjectStatus,
    private readonly _defaultPriority: ProjectDefaultPriority,
    private readonly _userId: UserId,
    private readonly _description?: ProjectDescription,
    private readonly _clientId?: string, //TODO: ClientIDを追加
    private readonly _createdAt: Date = new Date(),
    private readonly _updatedAt: Date = new Date()
  ) {
    super();
  }

  get id(): string {
    return this._id.getValue();
  }

  get name(): string {
    return this._name.getValue();
  }

  get description(): string | null {
    return this._description ? this._description.getValue() : null;
  }

  get colorHex(): string {
    return this._colorHex.getValue();
  }

  get status(): ProjectStatusEnum {
    return this._status.getValue();
  }

  get defaultPriority(): PriorityEnum {
    return this._defaultPriority.getValue();
  }

  get clientId(): string | null {
    return this._clientId || null;
  }

  get userId(): string {
    return this._userId.getValue();
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  public static create(
    id: string,
    name: string,
    colorHex: string,
    status: ProjectStatusEnum,
    defaultPriority: PriorityEnum,
    userId: string,
    description?: string,
    clientId?: string
  ) {
    return new Project(
      ProjectId.create(id),
      ProjectName.create(name),
      ProjectColorHex.create(colorHex),
      ProjectStatus.create(status),
      ProjectDefaultPriority.create(defaultPriority),
      UserId.create(userId),
      description ? ProjectDescription.create(description) || undefined : undefined,
      clientId ? clientId : undefined
    );
  }
}
