"use server";

import { createAdminClient } from "../appwrite";
import { InputFile } from "node-appwrite/file";
import { createServerAction, ServerActionError } from "../serverAction";
import { appwriteConfig } from "../appwrite/config";
import { ID, Models, Query } from "node-appwrite";
import { constructFileUrl, getFileType, parseStringify } from "../utils";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./user.action";

export const uploadFile = createServerAction(
  async ({ file, ownerId, accountId, path }: UploadFileProps) => {
    console.log("🚀 ~ file:", file);
    const { storage, databases } = await createAdminClient();

    const inputFile = InputFile.fromBuffer(file, file.name);

    const bucketFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      inputFile,
    );

    const fileDocument = {
      type: getFileType(inputFile.name).type,
      name: inputFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: getFileType(inputFile.name).extension,
      size: bucketFile.sizeOriginal,
      owner: ownerId,
      accountId,
      users: [],
      bucketFileId: bucketFile.bucketId,
    };

    console.log("🚀 ~ bucketFile:", bucketFile);

    const newFile = await databases
      .createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollectionId,
        ID.unique(),
        fileDocument,
      )
      .catch(async (error: any) => {
        await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id);
        throw new ServerActionError(error.message);
      });

    revalidatePath(path);

    return parseStringify(newFile);
  },
);

const createQueries = (
  currentUser: Models.Document,
  types?: string[],
  searchText?: string,
  sort?: string,
  limit?: number,
) => {
  const queries = [
    Query.or([
      Query.equal("owner", [currentUser.$id]),
      Query.contains("users", [currentUser.email]),
    ]),
  ];

  // if (types.length > 0) queries.push(Query.equal("type", types));
  // if (searchText) queries.push(Query.contains("name", searchText));
  // if (limit) queries.push(Query.limit(limit));

  // if (sort) {
  //   const [sortBy, orderBy] = sort.split("-");

  //   queries.push(
  //     orderBy === "asc" ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy),
  //   );
  // }

  return queries;
};

export const getFiles = createServerAction(async () => {
  const { databases } = await createAdminClient();
  const { error, ...currentUser } = await getCurrentUser();

  if (error) {
    throw new ServerActionError(error.message);
  }

  if (!currentUser?.accountId) {
    throw new ServerActionError("User not found");
  }

  const queries = createQueries(currentUser);

  const files = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.filesCollectionId,
    queries,
  );

  return parseStringify(files);
});
