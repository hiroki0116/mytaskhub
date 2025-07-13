import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, IsEnum } from "class-validator";
import { ProjectStatusEnum } from "../../../domain/project/value-objects/project-status.value-object";
import { PriorityEnum } from "../../../domain/task/value-objects/task-priority.value-object";

export class UpdateProjectDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "プロジェクト名" })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: "プロジェクトの色" })
  colorHex?: string;

  @IsEnum(ProjectStatusEnum)
  @IsOptional()
  @ApiProperty({ description: "プロジェクトのステータス" })
  status?: ProjectStatusEnum;

  @IsEnum(PriorityEnum)
  @ApiProperty({ description: "プロジェクトのデフォルト優先度" })
  defaultPriority: PriorityEnum;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: "プロジェクトの説明" })
  description?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: "プロジェクトのクライアントID" })
  clientId?: string;
}
