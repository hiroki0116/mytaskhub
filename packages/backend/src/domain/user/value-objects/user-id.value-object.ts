export class UserId {
  private readonly value: string;
  private constructor(value: string) {
    this.value = value;
  }

  public static create(userId: string): UserId {
    if (!UserId.isValid(userId)) {
      throw new Error("無効なユーザーID形式です");
    }

    return new UserId(userId);
  }

  public static isValid(userId: string): boolean {
    // cuid()は通常25文字程度で、英数字と一部の特殊文字を含む
    const userIdRegex = /^[a-zA-Z0-9_-]{25,}$/;
    return userIdRegex.test(userId);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(userId?: UserId): boolean {
    return userId?.value === this.value;
  }

  public toJSON(): string {
    return this.value;
  }
}
