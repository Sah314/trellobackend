import { TaskStatus } from "@prisma/client";

export class Task {
  constructor(
    public readonly id: number | undefined,
    public readonly title: string,
    public readonly description: string,
    public readonly taskstatus: TaskStatus
  ) {}
}
