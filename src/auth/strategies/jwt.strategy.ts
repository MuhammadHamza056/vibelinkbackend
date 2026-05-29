import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtUser } from '../../common/decorators/current-user.decorator';

export type TokenType = 'access' | 'refresh';

export interface JwtPayload {
  sub: string;
  email: string;
  type: TokenType;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('jwt.secret') ?? 'dev_secret_change_me',
    });
  }

  async validate(payload: JwtPayload): Promise<JwtUser> {
    // Refresh tokens are signed with a different secret, but guard against a
    // mistyped token reaching protected routes regardless.
    if (payload.type !== 'access') {
      throw new UnauthorizedException('Invalid access token');
    }
    return { userId: payload.sub, email: payload.email };
  }
}
