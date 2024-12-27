"use server";

import { ID, OAuthProvider, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import bcrypt from "bcrypt";
import { avatarPlaceholderUrl } from "@/constants";
import { parseStringify } from "../utils";
import { createServerAction, ServerActionError } from "../serverAction";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export const getUserByEmail = createServerAction(async (email: string) => {
  try {
    const { databases } = await createAdminClient();

    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("email", [email])],
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
    console.log("🚀 ~ sendEmailOtp ~ session:", session);

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
    fullName,
    email,
    password,
  }: {
    fullName: string;
    email: string;
    password: string;
  }) => {
    try {
      const existingUser = await getUserByEmail(email);

      if (existingUser?.accountId) {
        if (existingUser?.provider === "github") {
          throw new ServerActionError("This email register with github");
        } else {
          throw new ServerActionError("User already exists");
        }
      }

      if (!existingUser) {
        const { databases } = await createAdminClient();

        const { accountId } = await sendEmailOtp(email);

        const hashedPassword = await hashPassword(password);

        await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.usersCollectionId,
          // ID.unique(), // make a random unique id for the document
          accountId, // use the account id as a unique id for the document
          {
            fullName,
            email,
            avatar: avatarPlaceholderUrl,
            password: hashedPassword,
            accountId,
          },
        );

        return parseStringify({ accountId });
      }
    } catch (error: any) {
      console.log("🚀 ~ error:", error);
      throw new ServerActionError(error.message);
    }
  },
);

export const loginUser = createServerAction(
  async ({ email, password }: { email: string; password: string }) => {
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      throw new ServerActionError("user doesn't exist");
    }

    if (existingUser?.provider === "github") {
      throw new ServerActionError("This email login with github");
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      throw new ServerActionError("Invalid credentials provided");
    }

    await sendEmailOtp(email);

    return parseStringify({ accountId: existingUser.accountId });
  },
);

export const signUpWithGithub = async () => {
  const { account } = await createAdminClient();

  const origin = (await headers()).get("origin");

  const redirectUrl = await account.createOAuth2Token(
    OAuthProvider.Github,
    `${origin}/oauth`, // Callback URL
    `${origin}/register`, // Redirect URL after successful login
    ["read:user", "user:email"],
  );

  return redirect(redirectUrl);
};

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
  },
);

export const getCurrentUser = createServerAction(async () => {
  try {
    const { databases, account } = await createSessionClient();

    const result = await account.get();

    const user = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId", result.$id)],
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
    redirect("/");
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
