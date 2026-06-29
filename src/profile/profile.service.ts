import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import {
  AVATAR_URL_PREFIX,
  UploadedImage,
} from './avatar-upload.config';

@Injectable()
export class ProfileService {
  constructor(private readonly usersService: UsersService) {}

  async get(userId: string) {
    const user = await this.usersService.findById(userId);
    return user.toJSON();
  }

  async update(userId: string, dto: UpdateProfileDto, avatar?: UploadedImage) {
    const user = await this.usersService.findById(userId);
    // The Swagger-only `avatar` field never carries data in the body.
    delete (dto as { avatar?: unknown }).avatar;
    Object.assign(user, dto);
    // An uploaded image wins over any avatarUrl string in the body.
    if (avatar) {
      user.avatarUrl = `${AVATAR_URL_PREFIX}/${avatar.filename}`;
    }
    await user.save();
    return user.toJSON();
  }

  async updateLocation(userId: string, dto: UpdateLocationDto) {
    const user = await this.usersService.findById(userId);
    // GeoJSON stores coordinates as [longitude, latitude].
    user.location = { type: 'Point', coordinates: [dto.lng, dto.lat] };
    await user.save();
    return user.toJSON();
  }
}
