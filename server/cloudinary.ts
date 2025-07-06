import { v2 as cloudinary } from 'cloudinary';
import { Request } from 'express';
import multer from 'multer';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Allow images and videos
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and videos are allowed.'));
    }
  },
});

// Upload single file to Cloudinary
export const uploadToCloudinary = async (
  buffer: Buffer,
  options: {
    folder?: string;
    public_id?: string;
    resource_type?: 'image' | 'video' | 'raw' | 'auto';
    transformation?: any;
  } = {}
): Promise<any> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: options.folder || 'church-cms',
        public_id: options.public_id,
        resource_type: options.resource_type || 'auto',
        transformation: options.transformation,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    ).end(buffer);
  });
};

// Delete file from Cloudinary
export const deleteFromCloudinary = async (public_id: string, resource_type: 'image' | 'video' = 'image'): Promise<any> => {
  return cloudinary.uploader.destroy(public_id, { resource_type });
};

// Get optimized image URL
export const getOptimizedImageUrl = (public_id: string, options: any = {}): string => {
  return cloudinary.url(public_id, {
    quality: 'auto',
    fetch_format: 'auto',
    ...options,
  });
};

export { upload, cloudinary };