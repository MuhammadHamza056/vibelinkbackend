import {
  Body,
  Controller,
  Get,
  Patch,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import {
  avatarMulterOptions,
  UploadedImage,
} from './avatar-upload.config';
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
  @ApiOperation({
    summary: 'Update profile fields, vibe tags, settings, and avatar image',
  })
  @ApiConsumes('multipart/form-data', 'application/json')
  @UseInterceptors(FileInterceptor('avatar', avatarMulterOptions))
  update(
    @CurrentUser('userId') userId: string,
    @Body() dto: UpdateProfileDto,
    @UploadedFile() avatar?: UploadedImage,
  ) {
    return this.profileService.update(userId, dto, avatar);
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
