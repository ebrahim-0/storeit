"use server";

import { createAdminClient } from "../appwrite";
import { InputFile } from "node-appwrite/file";
import { createServerAction, ServerActionError } from "../serverAction";
import { appwriteConfig } from "../appwrite/config";
import { ID } from "node-appwrite";
import { constructFileUrl, getFileType, parseStringify } from "../utils";
import { revalidatePath } from "next/cache";

export const uploadFile = createServerAction(
  async ({ file, ownerId, accountId, path }: UploadFileProps) => {
    console.log("🚀 ~ file:", file);
    const { storage, databases } = await createAdminClient();

    try {
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
    } catch (error: any) {
      throw new ServerActionError(error.message);
    }
  },
);
