import express, { Request, Response, NextFunction } from "express";
import { SignupRequest, LoginRequest } from "../dto/user.dto";
import { requestValidator } from "../utils/validator";
import { UserRepository } from "../repository/user.repository";
import { UserService } from "../service/user.service";
import { getUserFromRequest } from "./task.routes";

const router = express.Router();


const userRepository = new UserRepository();
const userService = new UserService(userRepository);

// login endpoint
router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("Inside /login");
     const authheader = req.headers.authorization;
     console.log(req.headers.authorization);
     if(authheader?.split(" ")[1] !== "null") {
       const result = await getUserFromRequest(req);
       console.log("User ID: ", result);
       if (result) {
         return res.status(200).json({ message: "Already logged in", result});
       }
     }  
    const { errors, input } = await requestValidator(LoginRequest, req.body);
      if (errors || !input) {
        return res.status(400).json({ errors, message: "Validation failed" });
      }

    const result = await userService.loginUser(input);
      if (!result) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.status(200).json({ result });
    
      
    } catch (error) {
      next(error);
    }
  }
);

// register endpoint
router.post(
  "/signup",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { errors, input } = await requestValidator(SignupRequest, req.body);
      if (errors || !input) {
        return res.status(400).json({ errors, message: "Validation failed" });
      }
      //console.log(input.firstname, input.lastname);
      const newUser = await userService.createUser(input);
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }
);

// Google OAuth endpoint
router.post(
  "/google",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("Inside /google");
      const { token } = req.body;
     
      const result = await userService.googleAuth(token);
      console.log("73....",result);
      //const userToken = await userService.generateToken(user);
      res.status(200).json({result});
    } catch (error) {
      next(error);
    }
  }
);

// Global error handler
router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
  });
});

export default router;
