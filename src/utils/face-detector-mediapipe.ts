import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as blazeface from '@tensorflow-models/blazeface';
import * as tf from '@tensorflow/tfjs';
import { loadImage, createCanvas } from 'canvas';

@Injectable()
export class FaceDetectorInterceptor implements NestInterceptor {
  private model: any;
  private isModelReady = false;

  private async loadModel() {
    if (this.isModelReady) return;

    try {
      // Use CPU backend for Node.js compatibility
      await tf.setBackend('cpu');
      await tf.ready();
      console.log('TensorFlow backend set to:', tf.getBackend());
      
      // Load the blazeface model
      this.model = await blazeface.load();
      this.isModelReady = true;
      console.log('Blazeface model loaded successfully');
    } catch (error) {
      console.error('Failed to load face detection model:', error);
      console.warn('Face detection will be disabled');
    }
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    
    console.log('Request files structure:', {
      isArray: Array.isArray(request.files),
      keys: request.files ? Object.keys(request.files) : 'no files'
    });

    // Extract images array - handle different structures
    let imagesArray: Express.Multer.File[] = [];

    if (Array.isArray(request.files)) {
      // Case 1: files is a direct array
      imagesArray = request.files;
      console.log('Files received as direct array, count:', imagesArray.length);
    } else if (request.files && request.files.images) {
      // Case 2: files is an object with images property
      imagesArray = Array.isArray(request.files.images) 
        ? request.files.images 
        : [request.files.images];
      console.log('Files received as object.images, count:', imagesArray.length);
    } else if (request.files) {
      // Case 3: files is an object, try to find any array
      const fileArrays = Object.values(request.files).filter(val => Array.isArray(val));
      if (fileArrays.length > 0) {
        imagesArray = fileArrays.flat() as Express.Multer.File[];
        console.log('Extracted files from object values, count:', imagesArray.length);
      }
    }

    if (imagesArray.length === 0) {
      throw new BadRequestException('No valid image files found in request');
    }

    console.log(`Processing ${imagesArray.length} image(s)`);

    // Load model
    await this.loadModel();

    // Check for faces if model is loaded
    if (this.isModelReady) {
      for (const file of imagesArray) {
        console.log(`Checking face in: ${file.originalname}`);
        const hasFace = await this.detectFace(file);
        if (!hasFace) {
          throw new BadRequestException(`No face detected in image: ${file.originalname}`);
        }
      }
      console.log('All images passed face detection');
    } else {
      console.warn('Face detector not available, skipping face validation');
    }

    return next.handle();
  }

  private async detectFace(file: Express.Multer.File): Promise<boolean> {
    try {
      // Load image using canvas (works in Node.js)
      const img = await loadImage(file.buffer);
      
      // Create canvas and draw image
      const canvas = createCanvas(img.width, img.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      // Detect faces using blazeface
      const predictions = await this.model.estimateFaces(canvas, false);
      
      console.log(`Found ${predictions.length} face(s) in image: ${file.originalname}`);
      
      if (predictions.length > 0) {
        predictions.forEach((pred, i) => {
          console.log(`  Face ${i + 1}: confidence ${pred.probability}`);
        });
      }
      
      return predictions.length > 0;
    } catch (error) {
      console.error('Error detecting faces in image:', file.originalname, error);
      // Allow image if detection fails (you can change this to false to be strict)
      return true;
    }
  }
}