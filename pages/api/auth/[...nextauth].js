import NextAuth, { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";
import Admin from "../../../models/Admin";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: async ({ session, token, user }) => {
      const adminEmails = await Admin.find({}).distinct("email");
      if (
        adminEmails.length === 0 &&
        session?.user?.email === "hk2863262@gmail.com"
      ) {
        return session;
      } else if (adminEmails.includes(session?.user?.email)) {
        return session;
      } else {
        return false;
      }
    },
  },
  timeout: 10000,
};

// ... rest of the file remains the same

export default NextAuth(authOptions);

export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    console.log("No session found");
    throw "No session";
  }
  console.log("Session found:", session);
  const adminEmails = await Admin.find({}).distinct("email");
  console.log("Admin emails:", adminEmails);
  if (adminEmails.length === 0 || adminEmails.includes(session?.user?.email)) {
    console.log("Access granted");
    return;
  }
  console.log("Access denied");
  res.status(401);
  res.end();
  throw "Unauthorized";
}
