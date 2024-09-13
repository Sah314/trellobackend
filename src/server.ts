import express from 'express';
import taskRoutes from './api/task.routes';
import userRoutes from './api/user.routes';
import cors from "cors";

const app = express()
app.use(
  cors({
    origin: "*", // Allow requests from your frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow these methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
  })
);

app.use(express.json());

app.use("/", taskRoutes);
app.use("/api", userRoutes);

app.listen(8081, () => {
  console.log('Server is running on port 3000')
})