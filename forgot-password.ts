import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Request } from 'express';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import * as crypto from "crypto";
import { MailerService } from '@nestjs-modules/mailer';
//import { MailerService } from 'nestjs-mailer';


@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  
  async getMyUser(id: string, req: Request) {
    const decodedUserInfo = req.user as { id: string; email: string };
    const foundUser = await this.prisma.users.findUnique({ where: { id } });

    if (!foundUser) {
      throw new NotFoundException();
    }

    if (foundUser.id !== decodedUserInfo.id) {
      throw new ForbiddenException();
    }

    delete foundUser.hashedPassword;

    return { user: foundUser };
  }

  async getUsers() {
     /* const users = */ return await this.prisma.users.findMany()
        
        /*{
          select: { id: true, email: true },
    });

    return { users };*/
  }

  async sendPasswordResetEmail(email: string) {
    const user = await this.prisma.users.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetUrl = `https://boredguysCorp.com/reset-password?token = ${resetToken}`;

    await this.prisma.users.update({
      where: { id: user.id },
      data: { resetToken },
    });

    await this.sendEmail(email, 'Password Reset', resetUrl);
  }

  private async sendEmail(to: string, subject: string, html: string) {
    await nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'gnituda05@gmail.com',
        pass: '(yoursmtppassword)',
      },
    }).sendMail({
      from: 'boredguysCorp.com',
      to,
      subject,
      html,
    });
    return 'Email sent!';
  }

}
