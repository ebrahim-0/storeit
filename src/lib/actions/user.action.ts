"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import bcrypt from "bcrypt";
import { avatarPlaceholderUrl } from "@/constants";
import { parseStringify } from "../utils";
import { TypeForm } from "@/components/AuthForm";
import { createServerAction, ServerActionError } from "../serverAction";

const getUserByEmail = createServerAction(async (email: string) => {
  const { databases } = await createAdminClient();

  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal("email", [email])]
  );

  return result.total > 0 ? result.documents[0] : null;
});

const sendEmailOtp = createServerAction(async (email: string) => {
  const { account } = await createAdminClient();

  const session = await account.createEmailToken(ID.unique(), email);

  return session.userId;
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
    const existingUser = await getUserByEmail(email);
    const accountId = await sendEmailOtp(email);

    if (existingUser && type === "register") {
      throw new ServerActionError("User already exists");
    }

    if (existingUser) {
      const isMatch = await bcrypt.compare(password, existingUser?.password);

      if (isMatch) {
        return parseStringify({ accountId });
      }

      if (!isMatch) throw new ServerActionError("Invalid credentials provided");

      if (!accountId) throw new ServerActionError("Failed to send an OTP");
    }

    if (!existingUser) {
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
  }
);

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};
