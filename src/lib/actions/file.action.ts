"use server";

import { createAdminClient } from "../appwrite";
import { InputFile } from "node-appwrite/file";
import { createServerAction, ServerActionError } from "../serverAction";
import { appwriteConfig } from "../appwrite/config";
import { ID, Models, Permission, Query, Role } from "node-appwrite";
import { constructFileUrl, getFileType, parseStringify } from "../utils";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./user.action";

export const uploadFile = createServerAction(
  async ({ file, ownerId, accountId, path }: UploadFileProps) => {
    const { storage, databases } = await createAdminClient();

    const inputFile = InputFile.fromBuffer(file, file.name);

    const bucketFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      inputFile,
    );

    console.log("🚀 ~ bucketFile:", bucketFile);

    const fileDocument = {
      type: getFileType(inputFile.name).type,
      name: inputFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: getFileType(inputFile.name).extension,
      size: bucketFile.sizeOriginal,
      owner: ownerId,
      accountId,
      users: [],
      bucketFileId: bucketFile.$id,
    };

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

export const renameFile = createServerAction(
  async ({ fileId, name, extension, path }: RenameFileProps) => {
    const { databases } = await createAdminClient();

    const newName = `${name}.${extension}`;

    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      {
        name: newName,
      },
    );

    revalidatePath(path);

    return parseStringify(updatedFile);
  },
);

export const updateFileUsers = createServerAction(
  async ({ fileId, emails, path }: UpdateFileProps) => {
    const { databases } = await createAdminClient();

    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      {
        users: emails,
      },
    );

    revalidatePath(path);

    return parseStringify(updatedFile);
  },
);

export const getFileByBucketFileId = createServerAction(
  async (bucketFileId: string) => {
    const { databases } = await createAdminClient();

    const file = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      [
        Query.or([
          Query.equal("bucketFileId", [bucketFileId]),
          Query.equal("$id", [bucketFileId]),
        ]),
      ],
    );

    return parseStringify(file?.documents[0]);
  },
);

export const updateToPublic = createServerAction(
  async (fileId: string, path: string) => {
    const { databases, storage } = await createAdminClient();

    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      {
        isPublic: true,
      },
    );

    const permis = await storage.updateFile(
      appwriteConfig.bucketId,
      fileId,
      ID.unique(),
      [
        Permission.read(Role.any()),
        Permission.update(Role.any()),
        Permission.delete(Role.any()),
        Permission.write(Role.any()),
      ],
    );
    console.log("🚀 ~ permis:", permis);

    revalidatePath(path);

    return parseStringify(updatedFile);
  },
);
