import { IQueryHandler } from "@nestjs/cqrs";
import { GetCurrentUserQuery } from "../queries/get-current-user.query";
import { GetCurrentUserResponseDto } from "../dto/responses/get-current-user-response.dto";
import {
  IUserRepository,
  USER_REPOSITORY,
} from "../../../domain/user/repositories/user.reposiroty.interface";
import { NotFoundException, Inject } from "@nestjs/common";

export class GetCurrentUserHandler implements IQueryHandler<GetCurrentUserQuery> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(query: GetCurrentUserQuery): Promise<GetCurrentUserResponseDto> {
    const { id } = query;

    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException("ユーザーが見つかりません");
    }

    return GetCurrentUserResponseDto.fromEntity(user);
  }
}
