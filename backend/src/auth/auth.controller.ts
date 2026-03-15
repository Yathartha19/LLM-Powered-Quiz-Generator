import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: Record<string, any>) {
    return this.authService.signup(body.name, body.email, body.password);
  }

  @Post('login')
  login(@Body() body: Record<string, any>) {
    return this.authService.login(body.email, body.password);
  }

  @Get('user/:id')
  getUser(@Param('id') id: string) {
    return this.authService.getUserById(id);
  }
}