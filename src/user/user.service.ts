/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { SafeUser, User } from './user.entity';
import { hash, compare } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { resolveTimezone } from 'src/common/utils/app.utils';
import { EmailService } from 'src/email/email.service';

export interface ServiceResponse<T> {
  message: string[];
  data: T[];
}

@Injectable()
export class UsersService {
  constructor(
    private readonly dataBaseService: DatabaseService,
    private readonly emailService: EmailService,
  ) {}

  public async createUser(
    dto: CreateUserDto,
  ): Promise<ServiceResponse<SafeUser>> {
    const { name, email, password, timezone } = dto;
    try {
      const existing = await this.dataBaseService.query<SafeUser[]>(
        'CHECK_USER_EMAIL_EXISTS',
        [email],
      );
      if (existing.length > 0) {
        throw new ConflictException(['Email is already registered']);
      }

      const id: string = uuidv4();
      const password_hash: string = await hash(password, 10);
      const resolvedTimezone = resolveTimezone(timezone);

      const rows = await this.dataBaseService.query<SafeUser[]>('CREATE_USER', [
        id,
        name,
        email,
        password_hash,
        resolvedTimezone,
      ]);

      await this.emailService.sendRegisterSuccess(
        email,
        name,
        resolvedTimezone,
      );

      return {
        message: ['User created successfully'],
        data: rows,
      };
    } catch (error) {
      console.error('Error in createUser:', error);
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException([
        'An unexpected error occurred while creating the user',
      ]);
    }
  }

  public async findAllUsers(): Promise<ServiceResponse<SafeUser>> {
    try {
      const rows = await this.dataBaseService.query<SafeUser[]>(
        'FIND_ALL_USERS',
        [],
      );

      if (rows.length === 0) {
        throw new NotFoundException(['No users found']);
      }

      return {
        message: ['Users fetched successfully'],
        data: rows,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException([
        'An unexpected error occurred while fetching users',
      ]);
    }
  }

  public async findUserById(id: string): Promise<ServiceResponse<SafeUser>> {
    try {
      const rows = await this.dataBaseService.query<SafeUser[]>(
        'FIND_USER_BY_ID',
        [id],
      );

      if (rows.length === 0) {
        throw new NotFoundException([`User with id ${id} not found`]);
      }

      return {
        message: ['User fetched successfully'],
        data: rows,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException([
        'An unexpected error occurred while fetching the user',
      ]);
    }
  }

  public async findUserByEmail(
    email: string,
  ): Promise<ServiceResponse<SafeUser>> {
    try {
      const rows = await this.dataBaseService.query<SafeUser[]>(
        'FIND_USER_BY_EMAIL',
        [email],
      );

      if (rows.length === 0) {
        throw new NotFoundException([`User with email ${email} not found`]);
      }

      return {
        message: ['User fetched successfully'],
        data: rows,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException([
        'An unexpected error occurred while fetching the user',
      ]);
    }
  }

  public async updateUser(
    id: string,
    dto: UpdateUserDto,
  ): Promise<ServiceResponse<SafeUser>> {
    try {
      await this.findUserById(id);

      const rows = await this.dataBaseService.query<SafeUser[]>('UPDATE_USER', [
        dto.name ?? null,
        dto.timezone ?? null,
        id,
      ]);

      return {
        message: ['User updated successfully'],
        data: rows,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException([
        'An unexpected error occurred while updating the user',
      ]);
    }
  }

  public async removeUser(id: string): Promise<ServiceResponse<null>> {
    try {
      await this.findUserById(id);
      await this.dataBaseService.query('DELETE_USER', [id]);

      return {
        message: ['User deleted successfully'],
        data: [],
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException([
        'An unexpected error occurred while deleting the user',
      ]);
    }
  }

  public async validatePassword(
    username: string,
    password: string,
  ): Promise<SafeUser | null> {
    try {
      const rows = await this.dataBaseService.query<User[]>(
        'FIND_USER_WITH_PASSWORD',
        [username],
      );
      if (rows.length === 0) return null;

      const user = rows[0];
      const match: boolean = await compare(password, user.password_hash);
      if (!match) return null;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_hash: _, ...safeUser } = user;
      return safeUser;
    } catch {
      return null;
    }
  }
}
