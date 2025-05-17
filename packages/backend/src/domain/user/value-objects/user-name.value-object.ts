export class UserName {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(name: string): UserName {
    if (!UserName.isValid(name)) {
      throw new Error("無効なユーザー名形式です");
    }

    return new UserName(name);
  }

  public static isValid(name: string): boolean {
    const nameRegex = /^[a-zA-Z0-9_-]{1,20}$/;
    return nameRegex.test(name);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(name?: UserName): boolean {
    return name?.value === this.value;
  }

  public toJSON(): string {
    return this.value;
  }
}
