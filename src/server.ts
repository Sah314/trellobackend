import express from 'express';
import taskRoutes from './api/task.routes';
import userRoutes from './api/user.routes';
import cors from "cors";
const port = process.env.SERVER_PORT || 8081;
const app = express()
app.use(
  cors({
    origin: "https://trelloclonefrontend.vercel.app", // Allow requests from your frontend
    methods: ["GET", "POST", "PATCH", "DELETE"], // Allow these methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
  })
);

app.use(express.json());

app.use("/", taskRoutes);
app.use("/api", userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});