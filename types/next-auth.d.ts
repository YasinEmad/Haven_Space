import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user?: DefaultSession['user'] & {
      id?: string;
    };
  }

  interface User {
    id?: string;
  }
}

import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}
