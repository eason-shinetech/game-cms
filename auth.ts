import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import dbConnect from "./lib/db";
import UserModel, { IUser } from "./models/user";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { z } from "zod";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const parsedCredentials = z
            .object({ email: z.string().email(), password: z.string().min(6) })
            .safeParse(credentials);
          if (!parsedCredentials.success) {
            return null;
          }
          const email = String(credentials.email).toLowerCase();
          const password = String(credentials.password);
          await dbConnect();
          // logic to verify if the user exists
          const user = await UserModel.findOne({ email: email }) as IUser | null;
          if (!user) {
            if (email === "zhaoshangtong@gmail.com") {
              await UserModel.create({
                email: email,
                password: await bcrypt.hash(String(password), 10),
              });
            }

            // No user found, so this is their first attempt to login
            // Optionally, this is also the place you could do a user registration
            throw new Error("User not found.");
          }

          if (!user.isActive) {
            throw new Error("User is not active.");
          }

          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) return null;

          // return user object with their profile data
          return {email: user.email, id: user._id.toString(), name: user.username};
        } catch (error) {
          console.log("[NEXT_AUTH]  authorize error:", error);
          return null;
        }
      },
    }),
  ],
});
