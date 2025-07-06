import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import sharp from 'sharp';
import { randomUUID } from 'crypto';
import path from 'path';

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer configuration for handling file uploads
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images, videos, and documents
    const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|avi|mov|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido'));
    }
  },
});

export interface UploadResult {
  url: string;
  key: string;
  filename: string;
  size: number;
  mimetype: string;
}

export interface ProcessedImage {
  original: UploadResult;
  thumbnail?: UploadResult;
  medium?: UploadResult;
}

export class UploadService {
  private cloudName: string;

  constructor() {
    this.cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'church-cms';
  }

  /**
   * Check if upload service is properly configured
   */
  isConfigured(): boolean {
    return !!(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    );
  }

  /**
   * Upload a file to Cloudinary
   */
  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'uploads'
  ): Promise<UploadResult> {
    if (!this.isConfigured()) {
      throw new Error('Upload service not configured. Please configure Cloudinary credentials.');
    }

    try {
      const fileExtension = path.extname(file.originalname);
      const fileName = `${randomUUID()}${fileExtension}`;
      const public_id = `${folder}/${fileName}`;

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            public_id,
            folder: `church-cms/${folder}`,
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        ).end(file.buffer);
      });

      return {
        url: (result as any).secure_url,
        key: (result as any).public_id,
        filename: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
      };
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('Failed to upload file');
    }
  }

  /**
   * Upload and process an image with multiple sizes using Cloudinary transformations
   */
  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'images'
  ): Promise<ProcessedImage> {
    if (!this.isConfigured()) {
      throw new Error('Upload service not configured. Please configure Cloudinary credentials.');
    }

    if (!file.mimetype.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    try {
      const baseFileName = randomUUID();
      const public_id = `church-cms/${folder}/${baseFileName}`;

      // Upload original image to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            public_id,
            folder: `church-cms/${folder}`,
            resource_type: 'image',
            transformation: [
              { width: 1920, height: 1080, crop: 'limit', quality: 'auto:good' }
            ]
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        ).end(file.buffer);
      });

      const cloudinaryResult = result as any;

      const original: UploadResult = {
        url: cloudinaryResult.secure_url,
        key: cloudinaryResult.public_id,
        filename: file.originalname,
        size: cloudinaryResult.bytes,
        mimetype: 'image/jpeg',
      };

      // Generate thumbnail URL with Cloudinary transformations
      const thumbnailUrl = cloudinary.url(cloudinaryResult.public_id, {
        width: 300,
        height: 200,
        crop: 'fill',
        quality: 'auto:good',
        format: 'jpg'
      });

      const thumbnail: UploadResult = {
        url: thumbnailUrl,
        key: `${cloudinaryResult.public_id}_thumb`,
        filename: `thumb_${file.originalname}`,
        size: cloudinaryResult.bytes,
        mimetype: 'image/jpeg',
      };

      // Generate medium URL with Cloudinary transformations
      const mediumUrl = cloudinary.url(cloudinaryResult.public_id, {
        width: 800,
        height: 600,
        crop: 'limit',
        quality: 'auto:good',
        format: 'jpg'
      });

      const medium: UploadResult = {
        url: mediumUrl,
        key: `${cloudinaryResult.public_id}_medium`,
        filename: `medium_${file.originalname}`,
        size: cloudinaryResult.bytes,
        mimetype: 'image/jpeg',
      };

      return {
        original,
        thumbnail,
        medium,
      };
    } catch (error) {
      console.error('Image upload error:', error);
      throw new Error('Failed to upload and process image');
    }
  }

  /**
   * Delete a file from Cloudinary
   */
  async deleteFile(key: string): Promise<void> {
    if (!this.isConfigured()) {
      throw new Error('Upload service not configured');
    }

    try {
      await cloudinary.uploader.destroy(key);
    } catch (error) {
      console.error('Delete error:', error);
      throw new Error('Failed to delete file');
    }
  }

  /**
   * Generate a signed URL for secure file access (Cloudinary)
   */
  async getPresignedUrl(public_id: string, expiresIn: number = 3600): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('Upload service not configured');
    }

    try {
      // Generate a signed URL that expires after specified time
      const timestamp = Math.round(new Date().getTime() / 1000) + expiresIn;
      
      return cloudinary.url(public_id, {
        sign_url: true,
        type: 'authenticated',
        resource_type: 'auto'
      });
    } catch (error) {
      console.error('Presigned URL error:', error);
      throw new Error('Failed to generate presigned URL');
    }
  }

  /**
   * Get upload configuration for frontend
   */
  getUploadConfig() {
    return {
      isConfigured: this.isConfigured(),
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'application/pdf'],
      cloudName: this.cloudName,
      provider: 'cloudinary',
    };
  }

  /**
   * Local fallback for development/demo purposes
   */
  async saveToLocal(
    file: Express.Multer.File,
    folder: string = 'uploads'
  ): Promise<UploadResult> {
    const fs = await import('fs/promises');
    const uploadDir = `./public/${folder}`;
    
    try {
      await fs.mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    const fileExtension = path.extname(file.originalname);
    const fileName = `${randomUUID()}${fileExtension}`;
    const filePath = `${uploadDir}/${fileName}`;

    await fs.writeFile(filePath, file.buffer);

    return {
      url: `/${folder}/${fileName}`,
      key: `${folder}/${fileName}`,
      filename: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    };
  }
}

export const uploadService = new UploadService();