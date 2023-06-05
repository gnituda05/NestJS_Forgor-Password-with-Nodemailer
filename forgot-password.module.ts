import { Module } from '@nestjs/common';
import { AuthService } from './forgot-password';
import { AuthController } from './forgot-password.controller';
import {JwtModule} from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'prisma/prisma.service';
import { MailerModule } from '@nestjs-modules/mailer';


@Module({
  imports:[JwtModule, PassportModule,
    MailerModule.forRoot({
      transport: {
        host: '0.0.0.0',
        port: 1025,
      },
      defaults: {
        from: 'gnituda@example.com',
      },
    }),],
  controllers: [AuthController],
  providers: [AuthService, UsersModule, UsersService, PrismaService]
})
export class AuthModule {}
