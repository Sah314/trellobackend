import express, { Request, Response, NextFunction } from "express";
import { SignupRequest, LoginRequest } from "../dto/user.dto";
import { requestValidator } from "../utils/validator";
import { UserRepository } from "../repository/user.repository";
import { UserService } from "../service/user.service";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const router = express.Router();
const userRepository = new UserRepository();
const userService = new UserService(userRepository);

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// login endpoint
router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { errors, input } = await requestValidator(LoginRequest, req.body);
      if (errors || !input) {
        return res.status(400).json({ errors, message: "Validation failed" });
      }

      const user = await userService.loginUser(input);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.status(200).json({user});
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
      console.log("Received token in /google", token);
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();

      if (!payload) {
        return res.status(400).json({ message: "Invalid Google token" });
      }

      const user = await userService.googleAuth(payload);
      //const userToken = await userService.generateToken(user);
      const jwttoken = jwt.sign({ user: user.id, email: user.email }, JWT_SECRET);
      res.status(200).json({ user:user.id, email:user.email, token: jwttoken});
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
