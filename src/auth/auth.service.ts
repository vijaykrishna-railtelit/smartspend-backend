import { Injectable } from '@nestjs/common';
import { LoginDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  login(loginDto: LoginDto): { accessToken: string } {
    const { username, password } = loginDto;

    if (username === 'vijay' && password === 'vijay123') {
      const payload = { username };

      const accessToken = this.jwtService.sign(payload);

      return { accessToken };
    }

    throw new Error('Invalid credentials');
  }
}
