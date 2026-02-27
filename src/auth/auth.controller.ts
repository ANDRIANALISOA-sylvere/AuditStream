import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    try {
      const result = await this.authService.googleLogin(req.user);

      const frontendUrl = process.env.FRONTEND_URL;
      const userData = encodeURIComponent(JSON.stringify(result.user));

      return res.redirect(
        `${frontendUrl}/auth/callback?token=${result.accessToken}&user=${userData}`,
      );
    } catch (error: any) {
      const frontendUrl = process.env.FRONTEND_URL;
      const errorMessage = encodeURIComponent(error.message);

      return res.redirect(
        `${frontendUrl}/auth/callback?error=unauthorized&message=${errorMessage}`,
      );
    }
  }
}
