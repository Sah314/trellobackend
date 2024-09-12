import { Task } from "../models/task.model";
import { TaskRepository } from "../repository/task.repository";

export class TaskService {

    _taskRepository: TaskRepository;
    constructor(private taskRepository: TaskRepository) {
        this._taskRepository = taskRepository;
    }

  createTask = async (data: any): Promise<Task> => {
    const createdTask = await this._taskRepository.createTask(data);
    return createdTask;
  };

  getTasks = async (limit:number, offset:number): Promise<Task[]> => {
    const tasks = this._taskRepository.getTasks(limit, offset);
    return tasks;
  };

  getTask = async (id: number): Promise<Task> => {
    const task = this._taskRepository.getTask(id);
    return task;
};
  updateTask = async (data: any): Promise<Task> => {
    const updatedTask = this._taskRepository.updateTask(data);
    return updatedTask;
};
  deleteTask = async (id: number): Promise<Task> => {

    const deletedTask = this._taskRepository.deleteTask(id);
    return deletedTask;
};
}

