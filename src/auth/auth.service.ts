import { Injectable } from '@nestjs/common';
import { LoginDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { username, password } = loginDto;

    if (username === 'vijay' && password === 'vijay123') {
      const payload = { username };

      const accessToken = this.jwtService.sign(payload);

      await this.emailService.sendWelcome(
        'vijayk.sanaboina@gmail.com',
        'Vijay Krishna Sanaboina',
      );

      return { accessToken };
    }

    throw new Error('Invalid credentials');
  }
}
