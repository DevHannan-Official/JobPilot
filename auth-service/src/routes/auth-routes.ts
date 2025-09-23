import { Router } from 'express';
import { signInUser, signUpUser } from '../controllers/auth-controllers.js';
import { validateBody } from '../middlewares/validator.middleware.js';
import { signInSchema, signUpSchema } from '../lib/schemas.js';

const router = Router();

router.post('/sign-up', validateBody(signUpSchema), signUpUser);
router.post('/sign-in', validateBody(signInSchema), signInUser);

export default router;
