// src/utils/face-detector.ts
import * as canvas from 'canvas';
import * as path from 'path';
import * as faceapi from 'face-api.js';
import { Canvas, Image } from 'canvas';


import '@mediapipe/face_detection';
import '@tensorflow/tfjs-core';
// Register WebGL backend.
import '@tensorflow/tfjs-backend-webgl';
import * as faceDetection from '@tensorflow-models/face-detection';

faceapi.env.monkeyPatch({
  Canvas: Canvas as unknown as typeof HTMLCanvasElement,
  Image: Image as unknown as typeof HTMLImageElement,
});

const MODEL_PATH = path.join(__dirname, '../models');
let modelsLoaded = false;
let modelsLoading: Promise<void> | null = null;

export async function loadModels() {
  if (modelsLoaded) return;
  if (!modelsLoading) {
    modelsLoading = faceapi.nets.tinyFaceDetector.loadFromDisk(MODEL_PATH)
      .then(() => { modelsLoaded = true; modelsLoading = null; });
  }
  return modelsLoading;
}

export async function hasHumanFace(imageBuffer: Buffer): Promise<boolean> {
  console.time('faceCheck');

  await loadModels();
  console.timeLog('faceCheck', '✅ models loaded');

  const img = (await canvas.loadImage(imageBuffer)) as unknown as HTMLImageElement;
  console.timeLog('faceCheck', '✅ image loaded');

  const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 160 });
  const detections = await faceapi.detectAllFaces(img, options);
  console.timeLog('faceCheck', '✅ detection done');

  console.timeEnd('faceCheck');
  return detections.length > 0;
}
