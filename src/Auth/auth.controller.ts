import { Controller, Post, Body, Get, UseGuards, Req, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../User/User.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() req) {
    const user = await this.authService.validateUser(req.email, req.password);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    return this.authService.login(user);
  }
  @Post('request-password-reset')
  async requestPasswordReset(@Body('email') email: string): Promise<void> {
    await this.userService.requestPasswordReset(email);
  }

  @Post('reset-password')
  async resetPassword(@Body('token') token: string, @Body('newPassword') newPassword: string): Promise<void> {
    await this.userService.resetPassword(token, newPassword);
  }
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async profile(@Req() req) {
      console.log('User from JWT:', req.user); // Log the user retrieved from JWT
      if (!req.user) {
          throw new UnauthorizedException('Invalid credentials');
      }
      return req.user;
  }
  
}
