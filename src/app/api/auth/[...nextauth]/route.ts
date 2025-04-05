import NextAuth, { Session, User as NextAuthUser } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
// authOptions en tu API de NextAuth

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };