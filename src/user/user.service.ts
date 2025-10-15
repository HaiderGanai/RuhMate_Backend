import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { onBoardingProcessDto } from './dto/update-data.dto';
import type { Cache } from 'cache-manager';
import bcrypt from 'node_modules/bcryptjs';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject('CACHE_MANAGER') private cacheManager: Cache
  ) {}

  async onBoardingProcess( id: string, data: onBoardingProcessDto ): Promise<{ message: string }> {
    //fetch the user by id
    const result = await this.userRepository.update(id, { ...data });
    if (result.affected === 0) {
    throw new NotFoundException('User not found');
}

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
    //get the user from the cache store
    const cachedUser = await this.cacheManager.get<User>(`profile:${id}`);
    if(cachedUser) {
      console.log("found user from the cached store")
      return cachedUser;
    }
    //else get the user from the db
    const user = await this.userRepository.findOne({where:{id}});
    if(!user) {
      throw new NotFoundException('User not found!')
    }
    //store in the cache with 5 min ttl
    await this.cacheManager.set(`profile:${id}`, user, 300 * 10000 ); 

    console.log('user not found in cached store, retreiving from db')

    return user;
    
  }

  async changePassword(id: string, body: ChangePasswordDto): Promise<{message: string}> {

    const { password, newPassword } = body;

    //fetch the user from db
    const user = await this.userRepository.findOne({where:{id}});
    if(!user) {
      throw new NotFoundException('User not found!')
    }

    //compare the password with the one in db
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if(!isPasswordMatch) {
      throw new BadRequestException('Invalid current password!')
    }

    //hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    //update in the db
    await this.userRepository.update({id}, {password: hashedPassword});

    return {message: "Password changed successfully!"}

  }

  async updateProfile(id, body: UpdateProfileDto): Promise<{message: string}> {
    //update user by id
    const result = await this.userRepository.update(id, {...body});
    if (result.affected === 0) {
    throw new NotFoundException('User not found');
}

    return {message: 'Profile updated successfully!'}
  }
}
