import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export async function uploadImages(files: Express.Multer.File[]) {
  try {
    const s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    console.log("AWS_ACCESS_KEY_ID:", process.env.AWS_ACCESS_KEY_ID);
console.log("AWS_SECRET_ACCESS_KEY:", process.env.AWS_SECRET_ACCESS_KEY);
console.log("AWS_REGION:", process.env.AWS_REGION);

    const uploads = await Promise.all(
      files.map(async (file) => {
        const command = new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME!,
          Key: `books/${file.originalname}`,
          Body: file.buffer,
          ContentType: file.mimetype, // optional, but good practice
        });

        await s3.send(command);

        return {
          Bucket: process.env.AWS_S3_BUCKET_NAME!,
          Key: `books/${file.originalname}`,
          Location: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/books/${file.originalname}`,
        };
      }),
    );

    return uploads;
  } catch (error) {
    throw error;
  }
}
