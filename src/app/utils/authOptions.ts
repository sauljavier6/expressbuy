import NextAuth, { Session, User as NextAuthUser } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        await connectDB();

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("Usuario no encontrado");
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValidPassword) {
          throw new Error("Contraseña incorrecta");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }: { user: NextAuthUser }) {
      try {
        await connectDB();
        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          await User.create({
            name: user.name,
            email: user.email,
            googleId: user.id,
            role: "user",
          });
        }

        return true;
      } catch (error) {
        console.error("Error en signIn callback:", error);
        return false;
      }
    },
    async session({ session, token }: { session: Session; token: any }) {
      try {
        if (session?.user) {
          const dbUser = await User.findOne({ email: session.user.email });
          if (dbUser) {
            session.user.id = dbUser._id.toString();
            session.user.role = dbUser.role;
          }
        }
        return session;
      } catch (error) {
        console.error("Error en session callback:", error);
        return session;
      }
    },
  },
};
