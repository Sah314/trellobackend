import { Task } from "../models/task.model";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class TaskRepository {
  async createTask(tsk: Task): Promise<Task> {
    //initialize the database client
    const Task = await prisma.task.create({
      data: {
        ...tsk,
        // Add the 'status' property and cast it to TaskStatus
      },
    });
    return Task as unknown as Task;
    //create task using the database client and orm
    //return the created task
  }
  async updateTask(data: Task): Promise<Task> {
    const updatedTask = await prisma.task.update({
      where: { id: data.id },
      data: {
        ...data,
        // Map the status property to the enum if needed
      },
    });
    return updatedTask as unknown as Task;
  }

  async getTasks(limit: number, offset: number): Promise<Task[]> {
    const tasks = await prisma.task.findMany({
      skip: offset,
      take: limit,
    });
    return tasks as unknown as Task[];
  }

  async getTask(id: number): Promise<Task> {
    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new Error(`Task with ID ${id} not found`);
    }

    return task as unknown as Task;
  }

  async deleteTask(id: number): Promise<Task> {
    const deletedTask = await prisma.task.delete({
      where: { id },
    });

    return deletedTask as unknown as Task;
  }
}