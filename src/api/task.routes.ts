import express, { Request, Response, NextFunction } from "express";
import { TaskRepository } from "../repository/task.repository";
import { TaskService } from "../service/task.service";
import { CreateTaskRequest, UpdateTaskRequest } from "../dto/task.dto";
import { requestValidator } from "../utils/validator";
import jwt from "jsonwebtoken"
import cors from "cors";
interface CustomRequest extends Request {
  user?: any;
}

const router = express.Router();
router.use(
  cors({
    origin: "https://trelloclonefrontend.vercel.app", // Allow requests from your frontend
    methods: ["GET", "POST", "PATCH", "DELETE", "HEAD"], // Allow these methods
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Origin",
      "Origin",
    ], // Allow these headers
    credentials: true, // Allow credentials
  })
);

router.options(
  "*",
  cors({
    origin: "https://trelloclonefrontend.vercel.app", // Allow requests from your frontend
    methods: ["GET", "POST", "PATCH", "DELETE", "HEAD"], // Allow these methods
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Origin",
      "Origin",
    ], // Allow these headers
    credentials: true, // Allow credentials
  })
);

const taskRepository = new TaskRepository();
const taskService = new TaskService(taskRepository);
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";


//Middleware to extract user from request (e.g., JWT authentication middleware)
const authMiddleWare = async(req: CustomRequest, res: Response, next: NextFunction) => {
  // Example: You can add your own logic to extract and verify user
  req.user = await getUserFromRequest(req);
  next();
}

router.post(
  "/task",authMiddleWare,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { errors, input } = await requestValidator(
        CreateTaskRequest,
        req.body
      );
      if (!input) {
        return res.status(400).json({ errors, message: "Validation failed" });
      }

      if (!(req as CustomRequest).user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const userId = (req as CustomRequest).user.id;
     
      const data = await taskService.createTask({
        ...input,
        userId: userId,
      });
      res.status(201).json(data);
    } catch (error) {
      next(error); // Let the global error handler manage the error
    }
  }
);

router.patch(
  "/task/:id",
  authMiddleWare,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { errors, input } = await requestValidator(
        UpdateTaskRequest,
        req.body
      );
      if (!input) {
        return res.status(400).json({ errors, message: "Validation failed" });
      }

      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ message: "Invalid task ID" });
      }

      if (!(req as CustomRequest).user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
const userId = (req as CustomRequest).user.id;
      const data = await taskService.updateTask({
        id,
        ...input,
        userId: userId,
      });
      res.status(200).json(data);
    } catch (error) {
      next(error); // Let the global error handler manage the error
    }
  }
);

router.get(
  "/task/:id",
  authMiddleWare,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ message: "Invalid task ID" });
      }
      const userId = (req as CustomRequest).user.id;
      const data = await taskService.getTask(id, userId);
      res.status(200).json(data);
    } catch (error) {
      next(error); // Let the global error handler manage the error
    }
  }
);

router.get(
  "/task",
  authMiddleWare,
  async (req: Request, res: Response, next: NextFunction) => {
    const limit = Number(req.query["limit"]) || 5;
    const offset = Number(req.query["offset"]) || 0;

    try {

       if (!(req as CustomRequest).user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
            const userId = (req as CustomRequest).user.id;

      const data = await taskService.getTasks(limit, offset, userId);
      res.status(200).json(data);
    } catch (error) {
      next(error); // Let the global error handler manage the error
    }
  }
);

router.delete(
  "/task/:id",
  authMiddleWare,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ message: "Invalid task ID" });
      }

      if (!(req as CustomRequest).user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const deletedTask = await taskService.deleteTask(
        id,
        (req as CustomRequest).user.id
      );
      if (!deletedTask) {
        return res
          .status(404)
          .json({ message: `Task with ID ${id} not found` });
      }

      res
        .status(200)
        .json({ message: `Successfully deleted task with ID ${id}` });
    } catch (error) {
      next(error); // Let the global error handler manage the error
    }
  }
);

// Global Error Handler
router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
  });
});

export const getUserFromRequest = async (req: Request) => {
  // Extract the token from the Authorization header
  //console.log("headers::",req.headers);
  const authHeader = req.headers.authorization || "";

  const jwtToken = authHeader.split(" ")[1];
  if (!jwtToken) {
    throw new Error("No token provided");
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(jwtToken, JWT_SECRET) as {
      id: number;
      email: string;
    };
    // Assuming the decoded token contains user info (id and email)
    return { id: decoded.id, email: decoded.email };
  } catch (error) {
    // Handle the case where token verification fails
    console.log("183.....",error);
    throw new Error("Invalid or expired token");
  }
};

export default router;

