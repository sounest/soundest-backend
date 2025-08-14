// middlewears/upload.js
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up Multer to upload directly to Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "uploads", // Cloudinary folder name
      resource_type: "auto", // automatically detect file type
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}` // unique name
    };
  }
});

const upload = multer({ storage });

export default upload;
