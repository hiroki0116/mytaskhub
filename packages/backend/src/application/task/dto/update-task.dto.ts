import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { PriorityEnum } from "../../../domain/task/value-objects/task-priority.value-object";
import { TaskStatusEnum } from "../../../domain/task/value-objects/task-status.value-object";

export class UpdateTaskDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "タスクのタイトル" })
  title: string;

  @IsEnum(TaskStatusEnum)
  @ApiProperty({ description: "タスクのステータス" })
  status: TaskStatusEnum;

  @IsEnum(PriorityEnum)
  @ApiProperty({ description: "タスクの優先度" })
  priority: PriorityEnum;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "プロジェクトID" })
  projectId: string;

  @IsDate()
  @IsOptional()
  @ApiProperty({ description: "タスクの期限" })
  deadline?: Date;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: "タスクの内容" })
  content?: string;
}
