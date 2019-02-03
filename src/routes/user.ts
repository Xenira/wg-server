import { Router } from 'express';

// Import used controllers
import * as userCtrl from '../controllers/user.controller';

const router: Router = Router();

router.get('/', userCtrl.getCurrentUser);

export default router;
