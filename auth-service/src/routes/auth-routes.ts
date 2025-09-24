import { Router } from 'express';
import {
  authorizeUser,
  forgetPassword,
  logoutUser,
  refreshToken,
  signInUser,
  signUpUser,
} from '../controllers/auth-controllers.js';
import { validateBody } from '../middlewares/validator.middleware.js';
import { forgetPasswordSchema, signInSchema, signUpSchema } from '../lib/schemas.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/sign-up', validateBody(signUpSchema), signUpUser);
router.post('/sign-in', validateBody(signInSchema), signInUser);

router.patch('/refresh-token', refreshToken);

router.post('/forget-password', validateBody(forgetPasswordSchema), forgetPassword);

router.get('/me', authenticateUser, authorizeUser);
router.get('/logout', authenticateUser, logoutUser);

export default router;
