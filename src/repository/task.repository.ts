//import { Task } from "../models/task.model";
import { PrismaClient,Task } from "@prisma/client";

const prisma = new PrismaClient();

export class TaskRepository {
  async createTask(tsk: Task): Promise<Task> {
    //initialize the database client
    try {
      console.log("Creating Task: ", tsk);
      
      const createdTask = await prisma.task.create({
        data: {
          userId: tsk.userId,
          title: tsk.title,
          description: tsk.description,
          taskstatus:tsk.taskstatus
          // Add the 'status' property and cast it to TaskStatus
        },
      });
      console.log("Created Task: ", createdTask.id);  
      return createdTask as unknown as Task;
    } catch (error) {
      console.error(error);
      throw new Error("Error creating task");
    }
    //create task using the database client and orm
    //return the created task
  }

  async updateTask(data: Task): Promise<Task> {

    const existingTask = await prisma.task.findUnique({
      where: { id: data.id , userId:data.userId},
    });
    

    const updatedTask = await prisma.task.update({
      where: { id: data.id },
      data: {
        userId:data.userId,
        taskstatus:data.taskstatus?data.taskstatus:existingTask?.taskstatus,
        title:data.title?data.title:existingTask?.title,
        description:data.description?data.description:existingTask?.description
        // Map the status property to the enum if needed
      },
    });
    return updatedTask as unknown as Task;
  }

  async getTasks(limit: number, offset: number, userId:string): Promise<Task[]> {
   try {
     const tasks = await prisma.task.findMany({
       skip: offset,
       take: limit,
        where: { userId: userId },
     });
     return tasks as unknown as Task[];
   } catch (error) {
      console.error(error);
      throw new Error(`Task with limit ${limit} not found`);
   }
  }

  async getTask(id: string, userId:string): Promise<Task> {
    const task = await prisma.task.findUnique({
      where: { id: id, userId: userId },
    });

    if (!task) {
      throw new Error(`Task with ID ${id} not found`);
    }

    return task as unknown as Task;
  }

  async deleteTask(id: string): Promise<Task> {
    const deletedTask = await prisma.task.delete({
      where: { id },
    });

    return deletedTask as unknown as Task;
  }
}