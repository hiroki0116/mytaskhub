import { AggregateRoot } from "@nestjs/cqrs";
import { UserId } from "../value-objects/user-id.value-object";
import { Email } from "../value-objects/email.value-object";
import { UserName } from "../value-objects/user-name.value-object";
import { FirebaseUid } from "../value-objects/firebase-uid.value-object";
import { ImageUrl } from "../value-objects/image-url.value-object";

export class User extends AggregateRoot {
  constructor(
    private readonly _id: UserId,
    private readonly _email: Email,
    private readonly _name: UserName,
    private readonly _firebaseUid: FirebaseUid,
    private readonly _imageUrl: ImageUrl | null,
    private readonly _createdAt: Date = new Date(),
    private readonly _updatedAt: Date = new Date()
  ) {
    super();
  }

  get id(): string {
    return this._id.getValue();
  }

  get email(): string {
    return this._email.getValue();
  }

  get name(): string {
    return this._name.getValue();
  }

  get firebaseUid(): string {
    return this._firebaseUid.getValue();
  }

  get imageUrl(): string | null {
    return this._imageUrl?.getValue() ?? null;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  /**
   * ファクトリーメソッド
   * ファイヤーベース認証を使用してユーザーを作成する
   */
  static create(
    id: string,
    email: string,
    name: string,
    firebaseUid: string,
    imageUrl?: string
  ): User {
    return new User(
      UserId.create(id),
      Email.create(email),
      UserName.create(name),
      FirebaseUid.create(firebaseUid),
      imageUrl ? ImageUrl.create(imageUrl) : null
    );
  }

  toJSON() {
    return {
      id: this._id,
      email: this._email,
      name: this._name,
      firebaseUid: this._firebaseUid,
      imageUrl: this._imageUrl,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
