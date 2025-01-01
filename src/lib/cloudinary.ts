import { v2 as cloudinary } from "cloudinary";
import { cloudinaryConfig } from "./config";

cloudinary.config({
  cloud_name: cloudinaryConfig.cloudName,
  api_key: cloudinaryConfig.apiKey,
  api_secret: cloudinaryConfig.apiSecret,
  secure: true,
});

export default cloudinary;
