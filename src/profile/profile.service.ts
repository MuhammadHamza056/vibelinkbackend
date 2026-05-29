import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly usersService: UsersService) {}

  async get(userId: string) {
    const user = await this.usersService.findById(userId);
    return user.toJSON();
  }

  async update(userId: string, dto: UpdateProfileDto) {
    const user = await this.usersService.findById(userId);
    Object.assign(user, dto);
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
