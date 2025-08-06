import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from '../Users/User.entity';
import { AuthService } from './Auth.service';
import { LoginDto } from './DTO/login.dto';
import { Public } from './Roles';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Authenticate user and return access token' })
  @ApiResponse({
    status: 201,
    description: 'User successfully logged in',
    schema: { example: { access_token: 'jwt.token.here' } },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  public async login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get currently logged-in user' })
  @ApiResponse({ status: 200, description: 'Returns the currently logged-in user' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public getCurrentUser(@Request() req: { user: User }): User {
    return req.user;
  }
}
