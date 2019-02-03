import { Router } from 'express';
import { authorize } from 'passport';

// Import used controllers
import Authorization from '../config/passport';
import * as userCtrl from '../controllers/user.controller';
import planerRouter from './planer';
import userRouter from './user';

const router: Router = Router();

router.get('/', userCtrl.getCurrentUser);
router.post('/login', authorize('local', {failWithError: true}), Authorization.login);
router.put('/register', userCtrl.register);
// router.delete('/path', jsonParser, ctrl.deleteFunction);

router.use('/user', Authorization.any, userRouter);
router.use('/planer', Authorization.any, planerRouter);

export default router;
