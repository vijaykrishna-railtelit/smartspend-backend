import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { UsersService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { username, password } = loginDto;
    try {
      const user = await this.usersService.validatePassword(username, password);
      console.log('User validated in AuthService:', user);

      if (!user) {
        throw new UnauthorizedException(['Invalid username or password']);
      }

      const payload = {
        sub: user.id,
        username: user.name,
        email: user.email,
      };

      const accessToken = this.jwtService.sign(payload);

      await this.emailService.sendWelcome(user.email, user.name);

      return { accessToken };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new InternalServerErrorException([
        'An unexpected error occurred during login',
      ]);
    }
  }
}
