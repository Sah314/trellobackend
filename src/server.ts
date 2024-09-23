import express from 'express';
import taskRoutes from './api/task.routes';
import userRoutes from './api/user.routes';
import cors from "cors";
const port = process.env.SERVER_PORT || 8080;
const app = express()
app.use(
  cors()
);

app.use(express.json());

app.use("/", taskRoutes);
app.use("/api", userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});