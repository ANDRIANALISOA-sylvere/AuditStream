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
    if (!user) throw new UnauthorizedException('No user from google');

    let existingUser = await this.userService.findUserByEmail(user.email);
    if (!existingUser) {
      throw new UnauthorizedException(
        'Access denied. Your account has not been created by an administrator',
      );
    }

    if (
      user.username !== existingUser.username ||
      user.picture !== existingUser.picture
    ) {
      existingUser = await this.userService.updateUserProfile(existingUser.id, {
        username: user.username,
        picture: user.picture,
      });
    }

    return this.generateTokenResponse(existingUser);
  }

  async emailLogin(email: string, password: string) {
    const user = await this.userService.validatePassword(email, password);
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }
    return this.generateTokenResponse(user);
  }

  private generateTokenResponse(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      picture: user.picture,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        username: user.username,
        picture: user.picture,
      },
    };
  }
}
