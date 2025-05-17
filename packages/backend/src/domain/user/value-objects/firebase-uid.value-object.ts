export class FirebaseUid {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(firebaseUid: string): FirebaseUid {
    if (!FirebaseUid.isValid(firebaseUid)) {
      throw new Error("無効なFirebase UID形式です");
    }

    return new FirebaseUid(firebaseUid);
  }

  public static isValid(firebaseUid: string): boolean {
    const firebaseUidRegex = /^[a-zA-Z0-9_-]{28}$/;
    return firebaseUidRegex.test(firebaseUid);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(firebaseUid?: FirebaseUid): boolean {
    return firebaseUid?.value === this.value;
  }

  public toJSON(): string {
    return this.value;
  }
}
