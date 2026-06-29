import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { mkdirSync } from 'fs';
import { tmpdir } from 'os';
import { extname, join } from 'path';
import { diskStorage } from 'multer';

// Public URL prefix (served statically in main.ts) and the disk folder behind it.
export const AVATAR_URL_PREFIX = '/uploads/avatars';
export const AVATAR_DIR = 'uploads/avatars';

// On read-only serverless hosts (e.g. Vercel) only the OS temp dir is writable,
// so uploads land there to avoid crashing. NOTE: files written to /tmp do NOT
// persist between invocations — avatar uploads need cloud storage (S3/Cloudinary)
// for production on such hosts.
const AVATAR_DEST = process.env.VERCEL
  ? join(tmpdir(), AVATAR_DIR)
  : AVATAR_DIR;

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
    // A function (not a string) so multer does NOT mkdir at construction time —
    // that would run during bootstrap and crash on read-only filesystems.
    // The directory is created lazily here, only when a file is actually uploaded.
    destination: (_req, _file, cb) => {
      mkdirSync(AVATAR_DEST, { recursive: true });
      cb(null, AVATAR_DEST);
    },
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
