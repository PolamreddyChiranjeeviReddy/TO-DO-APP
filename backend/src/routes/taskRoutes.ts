import { Router } from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.route('/').get(getTasks).post(createTask);
router.route('/:id').get(getTaskById).patch(updateTask).delete(deleteTask);

export default router;
