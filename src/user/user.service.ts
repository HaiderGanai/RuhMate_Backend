import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './dto/update-data.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async updateProfile(
    id: string,
    data: UpdateProfileDto,
  ): Promise<{ message: string }> {
    //fetch the user by id
    await this.userRepository.update(id, { ...data });

    //save into db
    return { message: "User's profile updated!" };
  }

  async uploadImages(id: string, files: Express.Multer.File[]) {
  // get existing images for this user
  const existingUser = await this.userRepository.query(
    `SELECT images FROM "user" WHERE id = $1`,
    [id],
  );

  let existingImages: { url: string; isMain: boolean }[] = [];
  if (existingUser.length > 0 && existingUser[0].images) {
    existingImages = existingUser[0].images;
  }

  const alreadyHasMain = existingImages.some(img => img.isMain);

  //prepare new image objects
  const newImages = files.map((file, index) => ({
    url: `/uploads/${file.filename}`,
    // only mark first as main if user doesn't have one already
    isMain: !alreadyHasMain && index === 0,
  }));

  // Save user with updated images
  await this.userRepository.query(
    `
    UPDATE "user"
    SET images = COALESCE(images, '[]'::jsonb) || $2::jsonb
    WHERE id = $1
    `,
    [id, JSON.stringify(newImages)],
  );

  return { message: 'Images uploaded successfully!' };
}


  async setMainImage(id: string, imageUrl: string) {
    //find the user
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    //check if user has any images uploaded
    if (!user.images || user.images.length === 0) {
      throw new NotFoundException('User has no uploaded images!');
    }

    //check if the provided image exists or not
    const imageExists = user.images.some((img) => img.url === imageUrl);
    if (!imageExists) {
      throw new NotFoundException('Image not found for this user!');
    }

    //find and update only one image
    user.images = user.images.map((img) => ({
      ...img,
      isMain: img.url === imageUrl,
    }));

    await this.userRepository.save(user);
    return user;
  }

  async getProfile(id: string): Promise<User> {
    //find the user based on id
    const user = await this.userRepository.findOne({where:{id}});
    if(!user) {
      throw new NotFoundException('Not Found!')
    }

    return user;
  }
}
