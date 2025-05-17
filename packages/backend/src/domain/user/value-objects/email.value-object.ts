export class Email {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(email: string): Email {
    if (!Email.isValid(email)) {
      throw new Error("無効なEメール形式です");
    }

    return new Email(email);
  }

  public static isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(email?: Email): boolean {
    return email?.value === this.value;
  }

  public toJSON(): string {
    return this.value;
  }
}
