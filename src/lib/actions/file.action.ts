"use server";

import { createAdminClient } from "../appwrite";
import { InputFile } from "node-appwrite/file";
import { createServerAction, ServerActionError } from "../serverAction";
import { appwriteConfig } from "../config";
import { ID, Models, Permission, Query, Role } from "node-appwrite";
import { constructFileUrl, getFileType, parseStringify } from "../utils";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./user.action";
import { v2 as cloudinary } from "cloudinary";

export const uploadFile = createServerAction(
  async ({ file, ownerId, accountId, path }: UploadFileProps) => {
    const { storage, databases } = await createAdminClient();

    const inputFile = InputFile.fromBuffer(file, file.name);

    const bucketFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      inputFile,
      [Permission.read(Role.users()), Permission.write(Role.users())],
      (progress) => {
        console.log(progress.progress);
      },
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
        // ID.unique(),// make a random unique id for the document
        bucketFile.$id, // use bucketFileId as document ID
        fileDocument,
      )
      .catch(async (error: any) => {
        await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id);
        throw new ServerActionError(error.message);
      });

    revalidatePath(path, "page");

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

    revalidatePath(path, "page");

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

    revalidatePath(path, "page");

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
    const { databases } = await createAdminClient();

    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      {
        isPublic: true,
      },
    );

    revalidatePath(path, "page");

    return parseStringify(updatedFile);
  },
);

export const deleteFile = createServerAction(
  async (fileId: string, path: string) => {
    try {
      const { databases, storage } = await createAdminClient();

      const deletedFile = await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollectionId,
        fileId,
      );

      if (deletedFile) {
        await storage.deleteFile(appwriteConfig.bucketId, fileId);
      }

      revalidatePath(path, "page");

      return parseStringify({ status: "success" });
    } catch (error: any) {
      throw new ServerActionError(error.message);
    }
  },
);

export const getFileView = async (fileId: string) => {
  const { storage } = await createAdminClient();

  const file = await storage.getFileView(appwriteConfig.bucketId, fileId);

  return file;
};
