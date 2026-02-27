import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private userService: UserService,
  ) {}

  async googleLogin(user: any) {
    if (!user) {
      throw new UnauthorizedException('No user from google');
    }

    let existingUser = await this.userService.findUserByEmail(user.email);

    if (!existingUser) {
      throw new UnauthorizedException(
        'Access denied. Your account has not been created by an administrator',
      );
    }

     if (user.username !== existingUser.username || user.picture !== existingUser.picture) {
      existingUser = await this.userService.updateUserProfile(existingUser.id, {
        username: user.username,
        picture: user.picture,
      });
    }

    const payload = {
      email: existingUser.email,
      sub: existingUser.id,
      role: existingUser.role,
      picture: existingUser.picture,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
        username: existingUser.username,
        picture: existingUser.picture,
      },
    };
  }
}
