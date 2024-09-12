enum TaskStatus{
    TODO = 'todo',
    INPROGRESS = 'inprogress',
    DONE = 'done'
}
export class Task {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly description: string,
    public readonly status: TaskStatus
  ) {}
}