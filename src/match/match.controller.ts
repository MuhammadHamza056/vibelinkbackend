import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { MatchService } from './match.service';
import { NearbyQueryDto } from './dto/nearby-query.dto';
import { ConnectDto } from './dto/connect.dto';

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

  @Post('connect')
  @ApiOperation({
    summary: 'Send a connection request to a nearby user',
  })
  connect(
    @CurrentUser('userId') userId: string,
    @Body() dto: ConnectDto,
  ) {
    return this.matchService.connect(userId, dto.userId);
  }

  @Get('connections')
  @ApiOperation({ summary: 'List the current user’s accepted connections' })
  connections(@CurrentUser('userId') userId: string) {
    return this.matchService.listConnections(userId);
  }

  @Delete('connections/:id')
  @ApiOperation({ summary: 'Leave an accepted connection' })
  leave(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
  ) {
    return this.matchService.leave(userId, id);
  }

  @Post('requests/:id/accept')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Accept an incoming connection request' })
  accept(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
  ) {
    return this.matchService.accept(userId, id);
  }

  @Post('requests/:id/reject')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reject an incoming connection request' })
  reject(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
  ) {
    return this.matchService.reject(userId, id);
  }
}
