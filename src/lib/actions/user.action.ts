"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import bcrypt from "bcrypt";
import { avatarPlaceholderUrl } from "@/constants";
import { parseStringify } from "../utils";
import { TypeForm } from "@/components/AuthForm";
import { createServerAction, ServerActionError } from "../serverAction";
import { cookies } from "next/headers";

const getUserByEmail = createServerAction(async (email: string) => {
  try {
    const { databases } = await createAdminClient();

    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("email", [email])]
    );

    return result.total > 0 ? result.documents[0] : null;
  } catch (error: any) {
    throw new ServerActionError(error.message);
  }
});

export const sendEmailOtp = createServerAction(async (email: string) => {
  try {
    const { account } = await createAdminClient();

    const session = await account.createEmailToken(ID.unique(), email);

    return parseStringify({ accountId: session.userId });
  } catch (error: any) {
    throw new ServerActionError(error.message);
  }
});

export const sendSmsOtp = createServerAction(async () => {
  const phone: string = "+201032868845";
  try {
    const { account } = await createAdminClient();

    const session = await account.createPhoneToken(ID.unique(), phone);

    return parseStringify({ accountId: session.userId });
  } catch (error: any) {
    throw new ServerActionError(error.message);
  }
});

export const createAccount = createServerAction(
  async ({
    fullName = null,
    email,
    password,
    type,
  }: {
    fullName?: any;
    email: string;
    password: string;
    type: TypeForm;
  }) => {
    try {
      const existingUser = await getUserByEmail(email);
      const { accountId } = await sendEmailOtp(email);

      if (existingUser && type === "register") {
        throw new ServerActionError("User already exists");
      }

      if (existingUser) {
        const isMatch = await bcrypt.compare(password, existingUser?.password);

        if (isMatch) {
          return parseStringify({ accountId });
        }

        if (!isMatch)
          throw new ServerActionError("Invalid credentials provided");

        if (!accountId) throw new ServerActionError("Failed to send an OTP");
      }

      if (!existingUser) {
        if (type === "login") {
          throw new ServerActionError("email doesn't exist");
        }

        const { databases } = await createAdminClient();

        const hashedPassword = await hashPassword(password);

        await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.usersCollectionId,
          ID.unique(),
          {
            fullName,
            email,
            avatar: avatarPlaceholderUrl,
            password: hashedPassword,
            accountId,
          }
        );

        return parseStringify({ accountId });
      }
    } catch (error: any) {
      throw new ServerActionError(error.message);
    }
  }
);

export const verifyOtp = createServerAction(
  async ({ accountId, otp }: { accountId: string; otp: string }) => {
    try {
      const { account } = await createAdminClient();

      const session = await account.createSession(accountId, otp);

      (await cookies()).set("appwrite-session", session.secret, {
        path: "/",
        sameSite: "strict",
        secure: true,
        httpOnly: true,
      });

      return parseStringify({ sessionId: session.$id });
    } catch (error: any) {
      console.log("🚀 ~ error at :", error);
      throw new ServerActionError(error.message);
    }
  }
);

export const getCurrentUser = createServerAction(async () => {
  try {
    console.log("fun in server");
    const { databases, account } = await createSessionClient();

    const result = await account.get();

    const user = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId", result.$id)]
    );

    if (user.total <= 0) return null;

    if (user.total > 0) {
      const { password, ...userWithoutPassword } = user.documents[0];

      return parseStringify(userWithoutPassword);
    }

    return parseStringify(user.documents[0]);
  } catch (error: any) {
    console.log("🚀 ~ error at :", error);
    throw new ServerActionError(error.message);
  }
});

export const logout = createServerAction(async () => {
  try {
    const { account } = await createSessionClient();
    await account.deleteSession("current");
    (await cookies()).delete("appwrite-session");
  } catch (error: any) {
    console.log("🚀 ~ error:", error);
    throw new ServerActionError(error.message);
  }
});

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};
