import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('An account with that email already exists');
    }
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      email: dto.email,
      username: dto.username,
      passwordHash,
    });
    return this.buildAuthResponse(user);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email, true);
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return this.buildAuthResponse(user);
  }

  // Exchange a valid refresh token for a fresh access token (+ rotated refresh
  // token). Throws if the refresh token is missing, expired, or tampered with.
  async refresh(refreshToken: string) {
    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.config.get<string>('jwt.refreshSecret'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid refresh token');
    }
    // Throws NotFound if the account was deleted since the token was issued.
    const user = await this.usersService.findById(payload.sub);
    return {
      accessToken: this.signAccessToken(user),
      refreshToken: this.signRefreshToken(user),
    };
  }

  private buildAuthResponse(user: UserDocument) {
    return {
      accessToken: this.signAccessToken(user),
      refreshToken: this.signRefreshToken(user),
      user: user.toJSON(),
    };
  }

  private signAccessToken(user: UserDocument): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      type: 'access',
    };
    // Secret/expiry come from JwtModule.registerAsync configuration.
    return this.jwtService.sign(payload);
  }

  private signRefreshToken(user: UserDocument): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      type: 'refresh',
    };
    return this.jwtService.sign(payload, {
      secret: this.config.get<string>('jwt.refreshSecret'),
      // @nestjs/jwt expects a ms-style string (StringValue); cast as the
      // existing JwtModule config does.
      expiresIn: (this.config.get<string>('jwt.refreshExpiresIn') ??
        '30d') as `${number}d`,
    });
  }
}
