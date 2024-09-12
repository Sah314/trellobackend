import express ,{Request,Response,NextFunction} from 'express';
import { TaskRepository } from '../repository/task.repository';
import { TaskService } from '../service/task.service';
import { CreateTaskRequest, UpdateTaskRequest } from '../dto/task.dto';
import { requestValidator } from '../utils/validator';
import { Task} from '../models/task.model';
import { TaskStatus } from '@prisma/client';
const router = express.Router();

// endpoints

const taskRepository = new TaskRepository();
export const taskService = new TaskService(taskRepository);

router.post("/task", async (req: Request, res: Response, next: NextFunction) => {
try {

    const {errors, input} = await requestValidator(CreateTaskRequest, req.body);
    if(!input){
        return res.status(400).json(errors);
    }

    const data = await taskService.createTask(input);
    res.status(201).json(data);
    }  catch (error) {
        next(error);
    }
}
);

router.patch("/task/:id", async (req: Request, res: Response, next: NextFunction) => { 
try {
    const { errors, input } = await requestValidator(
      UpdateTaskRequest,
      req.body
    );
    if (!input) {
      return res.status(400).json(errors);
    }

    const id = parseInt(req.params.id) || 0;
    const data = await taskService.createTask({id,...input});
    res.status(201).json(data);

} catch (error) {
        console.error(error);
    }
}
);

router.get("/task/:id", async (req: Request, res: Response, next: NextFunction) => {   
try {
    
} catch (error) {
        
    }
}
);

router.get("/task", async (req: Request, res: Response, next: NextFunction) => {
  const limit = Number(req.query["limit"]) || 5;
  const offset = Number(req.query["offset"]);

  try {
    const data = await taskService.getTasks(limit, offset);
    return res.status(200).json(data);
  } catch (error) {
    const err = error as Error;
    return res.status(500).json(err.message);
  }

});

router.delete(
  "/task/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const taskId = parseInt(req.params.id, 10);
      const deletedTask = await taskService.deleteTask(taskId);

      if (!deletedTask) {
        return res.status(404).json({ error: "Task not found" });
      }

      res.status(204).send(); // No content for successful deletion
    } catch (error) {
      next(error);
    }
  }
);



export default router;