import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { MatchService } from './match.service';
import { NearbyQueryDto } from './dto/nearby-query.dto';

@ApiTags('match')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get('nearby')
  @ApiOperation({
    summary: 'Find nearby users ranked by shared-vibe similarity',
  })
  nearby(
    @CurrentUser('userId') userId: string,
    @Query() query: NearbyQueryDto,
  ) {
    return this.matchService.nearby(userId, query);
  }
}
