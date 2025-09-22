import { Router, type Request, type Response } from 'express';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Hello from Auth Service!',
    status: 200,
  });
});

export default router;
