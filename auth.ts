import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: 'jwt',
  },

  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {

        if (
          typeof credentials?.email !== 'string' ||
          typeof credentials?.password !== 'string'
        ) {
          return null
        }
      
        const email = credentials.email.trim().toLowerCase()
        const password = credentials.password
      
        const user = await prisma.user.findUnique({
          where: { email },
        })
      
        if (!user) {
          return null
        }
      
        if (!user.passwordHash) {
          return null
        }
      
        const passwordValid = await bcrypt.compare(
          password,
          user.passwordHash
        )
      
      
        if (!passwordValid) {
          return null
        }
      
      
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      }
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }

      return token
    },

    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }

      return session
    },
  },
})