import { IsNotEmpty, IsString } from "class-validator";
import { TaskStatus } from "@prisma/client";
export class CreateTaskRequest {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  description!: string;

}
export class UpdateTaskRequest {
  @IsString()
  title?: string;

  @IsString()
  description?: string;

  taskstatus?: TaskStatus;


}
