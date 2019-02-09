import { Router } from 'express';

// Import used controllers
import * as taskCtrl from '../controllers/planer/task.controller';

const router: Router = Router();

router.get('/tasks', taskCtrl.getUserTasks);
router.post('/task', taskCtrl.createTask);
router.delete('/task/:id', taskCtrl.deleteTask);

export default router;
