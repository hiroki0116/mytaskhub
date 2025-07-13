export enum ProjectStatusEnum {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  ARCHIVED = "ARCHIVED",
}

export class ProjectStatus {
  constructor(private readonly value: ProjectStatusEnum) {}

  public static create(status: ProjectStatusEnum): ProjectStatus {
    if (!ProjectStatus.isValid(status)) {
      throw new Error("無効なプロジェクトステータスです");
    }

    return new ProjectStatus(status);
  }

  public static isValid(status: ProjectStatusEnum): boolean {
    return Object.values(ProjectStatusEnum).includes(status);
  }

  public getValue(): ProjectStatusEnum {
    return this.value;
  }

  toJSON(): ProjectStatusEnum {
    return this.value;
  }
}
