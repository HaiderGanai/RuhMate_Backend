// src/middleware/face-check.middleware.ts
import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { hasHumanFace } from '../utils/face-detector';

@Injectable()
export class FaceCheckMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const files = (req as any).files as Express.Multer.File[];

    console.log("The controll came in face detect middleware")

    if (!files || files.length === 0) {
      throw new BadRequestException('No images uploaded');
    }

    for (const file of files) {
      const containsFace = await hasHumanFace(file.buffer);
      if (!containsFace) {
        throw new BadRequestException(`No face detected in image: ${file.originalname}`);
      }
    }

    // All images contain faces
    next();
  }
}
