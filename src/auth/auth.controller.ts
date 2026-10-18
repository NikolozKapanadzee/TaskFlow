import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { IsAuthGuard } from 'src/guards/isAuthGuard.guard';
import { UserId } from 'src/decorators/userId.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(IsAuthGuard)
  @Get('me')
  getCurrentUser(@UserId() userId) {
    console.log(userId);

    return this.authService.getCurrentUser(userId);
  }
}
