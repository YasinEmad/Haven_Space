import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';
// @ts-ignore
import bcryptjs from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        // first check for a static admin user defined via environment variables
        const adminUser = process.env.ADMIN_USERNAME;
        const adminPass = process.env.ADMIN_PASSWORD;

        if (
          adminUser &&
          adminPass &&
          credentials.username === adminUser &&
          credentials.password === adminPass
        ) {
          return {
            id: 'admin',
            name: 'Administrator',
            email: process.env.ADMIN_EMAIL || '',
          };
        }

        // fall back to database lookup if env vars are not provided
        const user = await prisma.user.findUnique({ where: { email: credentials.username } });

        if (!user) {
          throw new Error('Invalid email or password');
        }

        const isPasswordMatch = await bcryptjs.compare(credentials.password, user.password);

        if (!isPasswordMatch) {
          throw new Error('Invalid email or password');
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
