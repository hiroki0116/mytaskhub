export class GetTasksByProjectQuery {
  constructor(
    public readonly projectId: string,
    public readonly userId: string
  ) {}
}
