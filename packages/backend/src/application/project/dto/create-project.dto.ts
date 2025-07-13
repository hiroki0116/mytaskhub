import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ProjectStatusEnum } from "../../../domain/project/value-objects/project-status.value-object";
import { PriorityEnum } from "../../../domain/task/value-objects/task-priority.value-object";

export class CreateProjectDto {
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
  @IsOptional()
  @ApiProperty({ description: "プロジェクトの優先度" })
  defaultPriority: PriorityEnum;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  clientId?: string;
}
