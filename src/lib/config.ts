export const appwriteConfig = {
  endpointUrl: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT?.trim()!,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT?.trim()!,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE?.trim()!,
  usersCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION?.trim()!,
  filesCollectionId: process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION?.trim()!,
  bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET?.trim()!,
  secretKey: process.env.NEXT_APPWRITE_KEY?.trim()!,
};

export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim()!,
  apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY?.trim()!,
  apiSecret: process.env.NEXT_PUBLIC_CLOUDINARY_SECRET?.trim()!,
  cloudinaryUrl: process.env.NEXT_PUBLIC_CLOUDINARY_URL?.trim()!,
};
