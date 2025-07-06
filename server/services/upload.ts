import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import multer from 'multer';
import sharp from 'sharp';
import { randomUUID } from 'crypto';
import path from 'path';

// AWS S3 Configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
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
  private bucketName: string;

  constructor() {
    this.bucketName = process.env.AWS_S3_BUCKET || 'church-cms-uploads';
  }

  /**
   * Check if upload service is properly configured
   */
  isConfigured(): boolean {
    return !!(
      process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY &&
      process.env.AWS_S3_BUCKET &&
      process.env.AWS_REGION
    );
  }

  /**
   * Upload a file to S3
   */
  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'uploads'
  ): Promise<UploadResult> {
    if (!this.isConfigured()) {
      throw new Error('Upload service not configured. Please configure AWS credentials.');
    }

    try {
      const fileExtension = path.extname(file.originalname);
      const fileName = `${randomUUID()}${fileExtension}`;
      const key = `${folder}/${fileName}`;

      const uploadParams = {
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentDisposition: 'inline',
      };

      await s3Client.send(new PutObjectCommand(uploadParams));

      const url = `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

      return {
        url,
        key,
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
   * Upload and process an image with multiple sizes
   */
  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'images'
  ): Promise<ProcessedImage> {
    if (!this.isConfigured()) {
      throw new Error('Upload service not configured. Please configure AWS credentials.');
    }

    if (!file.mimetype.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    try {
      const fileExtension = path.extname(file.originalname);
      const baseFileName = randomUUID();

      // Process original image
      const processedBuffer = await sharp(file.buffer)
        .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 90 })
        .toBuffer();

      // Upload original
      const originalKey = `${folder}/${baseFileName}_original.jpg`;
      await s3Client.send(new PutObjectCommand({
        Bucket: this.bucketName,
        Key: originalKey,
        Body: processedBuffer,
        ContentType: 'image/jpeg',
        ContentDisposition: 'inline',
      }));

      const original: UploadResult = {
        url: `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${originalKey}`,
        key: originalKey,
        filename: file.originalname,
        size: processedBuffer.length,
        mimetype: 'image/jpeg',
      };

      // Create thumbnail (300x200)
      const thumbnailBuffer = await sharp(file.buffer)
        .resize(300, 200, { fit: 'cover' })
        .jpeg({ quality: 80 })
        .toBuffer();

      const thumbnailKey = `${folder}/${baseFileName}_thumb.jpg`;
      await s3Client.send(new PutObjectCommand({
        Bucket: this.bucketName,
        Key: thumbnailKey,
        Body: thumbnailBuffer,
        ContentType: 'image/jpeg',
        ContentDisposition: 'inline',
      }));

      const thumbnail: UploadResult = {
        url: `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${thumbnailKey}`,
        key: thumbnailKey,
        filename: `thumb_${file.originalname}`,
        size: thumbnailBuffer.length,
        mimetype: 'image/jpeg',
      };

      // Create medium size (800x600)
      const mediumBuffer = await sharp(file.buffer)
        .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer();

      const mediumKey = `${folder}/${baseFileName}_medium.jpg`;
      await s3Client.send(new PutObjectCommand({
        Bucket: this.bucketName,
        Key: mediumKey,
        Body: mediumBuffer,
        ContentType: 'image/jpeg',
        ContentDisposition: 'inline',
      }));

      const medium: UploadResult = {
        url: `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${mediumKey}`,
        key: mediumKey,
        filename: `medium_${file.originalname}`,
        size: mediumBuffer.length,
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
   * Delete a file from S3
   */
  async deleteFile(key: string): Promise<void> {
    if (!this.isConfigured()) {
      throw new Error('Upload service not configured');
    }

    try {
      await s3Client.send(new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      }));
    } catch (error) {
      console.error('Delete error:', error);
      throw new Error('Failed to delete file');
    }
  }

  /**
   * Generate a presigned URL for secure file access
   */
  async getPresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('Upload service not configured');
    }

    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      return await getSignedUrl(s3Client, command, { expiresIn });
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
      bucketName: this.bucketName,
      region: process.env.AWS_REGION || 'us-east-1',
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