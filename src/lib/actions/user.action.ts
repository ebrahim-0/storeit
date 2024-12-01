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

  try {
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("email", [email])]
    );

    return result.total > 0 ? result.documents[0] : null;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw new ServerActionError("Failed to retrieve user information");
  }
});

const sendEmailOtp = createServerAction(async (email: string) => {
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken(ID.unique(), email);

    return session.userId;
  } catch (error) {
    console.error("Error sending email OTP:", error);
    throw new ServerActionError("Failed to send email OTP");
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
      const accountId = await sendEmailOtp(email);

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
      console.error("Error creating account:", error);
      throw new ServerActionError(error?.message);
    }
  }
);

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};
