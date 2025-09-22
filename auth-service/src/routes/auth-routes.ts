import { Router } from 'express';
import { signUpUser } from '../controllers/auth-controllers.js';
import { validateBody } from '../middlewares/validator.middleware.js';
import { signupSchema } from '../lib/schemas.js';

const router = Router();

router.post('/sign-up', validateBody(signupSchema), signUpUser);

export default router;
