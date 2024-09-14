// /D:/Sahil/vooshTask/backend/src/repository/__tests__/task.repository.test.ts

import { TaskRepository } from "../task.repository";
import { PrismaClient, Task, TaskStatus } from "@prisma/client";
import { jest } from "@jest/globals";

jest.mock("@prisma/client", () => {
  const mPrismaClient = {
    task: {
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

describe("TaskRepository", () => {
  let taskRepository: TaskRepository;
  let prisma: PrismaClient;

  beforeAll(() => {
    taskRepository = new TaskRepository();
    prisma = new PrismaClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createTask", () => {
    it("should create a task successfully", async () => {
      const taskData = {
        id: 1,
        title: "Test Task",
        description: "Test Description",
        userId: 1,
        taskstatus: TaskStatus.INPROGRESS,
        createdAt: new Date(),
      } as Task;

jest.spyOn(prisma.task, "create").mockResolvedValue(taskData);

      const result = await taskRepository.createTask(taskData);

      expect(prisma.task.create).toHaveBeenCalledWith({
        data: {
          ...taskData,
          taskstatus: taskData.taskstatus,
        },
      });
      expect(result).toEqual(taskData);
    });

    it("should throw an error if task creation fails", async () => {
      const taskData: Task = {
        id: 1,
        title: "Test Task",
        description: "Test Description",
        taskstatus: TaskStatus.INPROGRESS,
        userId: 1,
        createdAt: new Date(),
      };

     jest
       .spyOn(prisma.task, "create")
       .mockRejectedValue(new Error("Task creation failed"));


      await expect(taskRepository.createTask(taskData)).rejects.toThrow(
        "Task creation failed"
      );
    });
  });
});
