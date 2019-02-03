import { Router } from 'express';

// Import used controllers
import * as taskCtrl from '../controllers/planer/task.controller';

const router: Router = Router();

router.post('/task', taskCtrl.createTask);

export default router;
