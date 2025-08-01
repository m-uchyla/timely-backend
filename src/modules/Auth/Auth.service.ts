import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../Users/User.entity';
import { UsersService } from '../Users/Users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  public async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _password, ...result } = user; // Exclude password from the result
      return result;
    }
    return null;
  }

  public async login(user: { email: string; password: string }): Promise<{ access_token: string }> {
    const validatedUser = await this.validateUser(user.email, user.password);
    if (!validatedUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      username: validatedUser.email,
      sub: validatedUser.id,
      role: validatedUser.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
