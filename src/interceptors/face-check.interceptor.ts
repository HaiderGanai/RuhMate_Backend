import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { hasHumanFace } from '../utils/face-detector';

@Injectable()
export class FaceCheckInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const files = req.files as Express.Multer.File[];

    console.log("The controll came in the image detection interceptor")

    if (!files || files.length === 0) {
      throw new BadRequestException('No images uploaded');
    }

    for (const file of files) {
      const containsFace = await hasHumanFace(file.buffer);
      if (!containsFace) {
        throw new BadRequestException(`No face detected in image: ${file.originalname}`);
      }
    }

    return next.handle();
  }
}
