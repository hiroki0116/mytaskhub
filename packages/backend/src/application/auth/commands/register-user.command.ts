export class RegisterUserCommand {
  constructor(
    public readonly email: string,
    public readonly name: string,
    public readonly firebaseToken: string,
    public readonly password?: string
  ) {}
}
