import { Body, Controller, Get, Patch, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { VIBE_TAGS } from '../common/constants/app.constants';

@ApiTags('profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Get the current user profile' })
  get(@CurrentUser('userId') userId: string) {
    return this.profileService.get(userId);
  }

  @Get('vibe-tags')
  @ApiOperation({ summary: 'List the canonical vibe tags users can pick from' })
  vibeTags() {
    return { tags: VIBE_TAGS };
  }

  @Patch()
  @ApiOperation({ summary: 'Update profile fields, vibe tags, and settings' })
  update(
    @CurrentUser('userId') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profileService.update(userId, dto);
  }

  @Put('location')
  @ApiOperation({ summary: 'Update the user location used for nearby matching' })
  updateLocation(
    @CurrentUser('userId') userId: string,
    @Body() dto: UpdateLocationDto,
  ) {
    return this.profileService.updateLocation(userId, dto);
  }
}
