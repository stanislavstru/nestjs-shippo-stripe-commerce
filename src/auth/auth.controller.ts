import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { GoogleOAuthGuard } from './google/google-oauth.guard';
import { AuthService } from './auth.service';
import { ApiResponse } from '@nestjs/swagger';
import { AuthResponseDto } from './dtos';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleLogin() {
    // Initiates the Google authentication process
  }

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  @ApiResponse({
    status: 302,
    description: 'Redirects to the specified URL with parameters',
    type: AuthResponseDto,
  })
  async googleCallback(@Req() req, @Res() res) {
    // Successful authentication
    // const user = req.user;

    try {
      const jwt = await this.authService.googleLogin(req);

      if (!jwt) throw new Error('Login failed');

      return res.redirect(
        `${process.env.CLIENT_APP_DOMAIN}/api/auth?access_token=${jwt.access_token}&roles=${jwt.role.join(',')}`,
      );
    } catch (error) {
      console.error(error);
      return res.redirect(
        `${process.env.CLIENT_APP_DOMAIN}?error=login_failed`,
      );
    }
  }
}
