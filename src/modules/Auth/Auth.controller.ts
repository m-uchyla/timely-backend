import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './Auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  public async login(
    @Body() loginDto: { email: string; password: string },
  ): Promise<{ access_token: string }> {
    return this.authService.login(loginDto);
  }
}
