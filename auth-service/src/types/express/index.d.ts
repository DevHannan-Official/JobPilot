import type { User } from '@prisma/client'; // adjust path to your generated Prisma types

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
