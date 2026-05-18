import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { DatabaseService } from 'src/database/database.service';
import { EmailService } from 'src/email/email.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, DatabaseService, EmailService],
})
export class UsersModule {}
