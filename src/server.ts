import express from 'express';
import taskRoutes from './api/task.routes';
import userRoutes from './api/user.routes';

const app = express()

app.use(express.json());

app.use("/", taskRoutes);
app.use("/user", userRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})