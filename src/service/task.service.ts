import { TaskStatus,Task } from "@prisma/client";
import { TaskRepository } from "../repository/task.repository";

export class TaskService {

    _taskRepository: TaskRepository;
    constructor(private taskRepository: TaskRepository) {
        this._taskRepository = taskRepository;
    }

  createTask = async (data: any): Promise<Task> => {
   try {
    const task: Task = {
      id: data.id,
      title: data.title,
      description: data.description,
      taskstatus: TaskStatus.TODO,
      userId: data.userId,
      createdAt: new Date(),
    };
    const createdTask = await this._taskRepository.createTask(task);
    return createdTask;
  }
  catch(error){
    throw new Error(`Task with ID ${data.id} not found`);
  }
  };

  getTasks = async (limit:number, offset:number): Promise<Task[]> => {
    try {
      const tasks = await this._taskRepository.getTasks(limit, offset);
      return tasks;
    } catch (error) {
      throw error;
    }
  };

  getTask = async (id: number): Promise<Task> => {
   try {
     const task = await this._taskRepository.getTask(id);
     return task;
   } catch (error) {
    throw error;
   }
};
  updateTask = async (data: any): Promise<Task> => {
   try {
     const existingTask = await this._taskRepository.getTask(data.id);
     if (!existingTask) {
       throw new Error(`Task with ID ${data.id} not found`);
     }
     const updatedTask = await this._taskRepository.updateTask(data);
     return updatedTask;
   } catch (error) {
      throw error;
   }
};
  deleteTask = async (id: number, userId:number): Promise<Task> => {
 try {
  const existingTask = await this._taskRepository.getTask(id);
  if (!existingTask) {
    throw new Error(`Task with ID ${id} not found`);
  }
     const deletedTask =await this._taskRepository.deleteTask(id);
     return deletedTask;
 } catch (error) {
    throw error;
 }
};
}

