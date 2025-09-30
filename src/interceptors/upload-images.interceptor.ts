import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

export function UploadImagesInterceptor(fieldName = 'images', maxCount = 10) {
  return FilesInterceptor(fieldName, maxCount, {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        callback(null, uniqueName);
      },
    }),
  });
}
