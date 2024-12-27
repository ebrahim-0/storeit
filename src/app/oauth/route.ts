// src/app/oauth/route.js

import { avatarPlaceholderUrl } from "@/constants";
import { getUserByEmail } from "@/lib/actions/user.action";
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  console.log("🚀 ~ GET ~ request.url:", request.url);
  const userId = searchParams.get("userId") as string;
  const secret = searchParams.get("secret") as string;

  const { account, databases } = await createAdminClient();

  const session = await account.createSession(userId, secret);

  (await cookies()).set("appwrite-session", session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  const { account: accountSession } = await createSessionClient();

  const result = await accountSession.get();

  const existingUser = await getUserByEmail(result?.email);

  if (!existingUser?.accountId) {
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      // ID.unique(), // make a random unique id for the document
      result?.$id, // use the account id as a unique id for the document
      {
        fullName: result?.name,
        email: result?.email,
        avatar: result?.prefs?.avatar ?? avatarPlaceholderUrl,
        password: result?.password ?? "",
        accountId: result?.$id,
        provider: "github",
      },
    );
  }

  redirect("/");
}
