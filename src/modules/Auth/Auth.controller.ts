import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './Auth.service';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

@Controller('auth')

class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  public async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ access_token: string }> {
    return this.authService.login(loginDto);
  }
}
