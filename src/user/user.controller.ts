import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { JwtStrategy } from '../auth/jwt.strategy';
import { SafeUser } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateUserDto,
  ): Promise<{ message: string[]; data: SafeUser[] }> {
    return this.usersService.createUser(dto);
  }

  @UseGuards(JwtStrategy)
  @Get()
  findAll(): Promise<{ message: string[]; data: SafeUser[] }> {
    return this.usersService.findAllUsers();
  }

  //   @UseGuards(JwtStrategy)
  //   @Get('me')
  //   getMe(@Request() req) {
  //     return this.usersService.(req.user.id);
  //   }

  @UseGuards(JwtStrategy)
  @Get(':id')
  findOne(
    @Param('id') id: string,
  ): Promise<{ message: string[]; data: SafeUser[] }> {
    return this.usersService.findUserById(id);
  }

  @UseGuards(JwtStrategy)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<{ message: string[]; data: SafeUser[] }> {
    return this.usersService.updateUser(id, dto);
  }

  @UseGuards(JwtStrategy)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id') id: string,
  ): Promise<{ message: string[]; data: null[] }> {
    return this.usersService.removeUser(id);
  }
}
