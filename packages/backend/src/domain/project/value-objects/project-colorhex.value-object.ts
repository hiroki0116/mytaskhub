export class ProjectColorHex {
  private static readonly DEFAULT_COLOR = "#6366F1";

  constructor(private readonly value: string) {}

  public static create(value?: string): ProjectColorHex {
    if (!value || value.trim() === "") {
      return new ProjectColorHex(ProjectColorHex.DEFAULT_COLOR);
    }

    if (!ProjectColorHex.isValid(value)) {
      return new ProjectColorHex(ProjectColorHex.DEFAULT_COLOR);
    }

    return new ProjectColorHex(value);
  }

  public static isValid(colorHex: string): boolean {
    // カラーコードの形式をチェック (#RRGGBB または #RGB)
    const colorHexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return colorHexRegex.test(colorHex);
  }

  public getValue(): string {
    return this.value;
  }

  toJSON(): string {
    return this.value;
  }
}
