import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { diskStorage } from 'multer';

// Public URL prefix (served statically in main.ts) and the disk folder behind it.
export const AVATAR_URL_PREFIX = '/uploads/avatars';
export const AVATAR_DIR = 'uploads/avatars';

// Minimal shape of a multer file (avoids needing @types/multer).
export interface UploadedImage {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  path: string;
}

const IMAGE_MIME = /^image\/(jpeg|jpg|png|webp|gif|heic|heif)$/;

export const avatarMulterOptions = {
  storage: diskStorage({
    destination: AVATAR_DIR,
    filename: (_req, file, cb) => {
      cb(null, `${randomUUID()}${extname(file.originalname).toLowerCase()}`);
    },
  }),
  fileFilter: (_req, file, cb) => {
    if (!IMAGE_MIME.test(file.mimetype)) {
      return cb(
        new BadRequestException('Only image files are allowed for the avatar'),
        false,
      );
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
};
