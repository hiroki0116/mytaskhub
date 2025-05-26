export class ImageUrl {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(url: string | null | undefined): ImageUrl | null {
    if (url === undefined || url === null || url.trim() === "") {
      return null;
    }

    if (!ImageUrl.isValid(url)) {
      throw new Error("無効な画像URLです");
    }
    return new ImageUrl(url);
  }

  public static isValid(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  public getValue(): string {
    return this.value;
  }

  public equals(imageUrl?: ImageUrl | null): boolean {
    if (imageUrl === null || imageUrl === undefined) {
      return false;
    }
    return this.value === imageUrl.value;
  }

  public toJSON(): string {
    return this.value;
  }
}
