import { Injectable, Logger, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private prisma: PrismaService) {}

  async register(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const newUser = await this.prisma.user.create({
        data: {
          fullName: createUserDto.fullName,
          email: createUserDto.email,
          password: hashedPassword,
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          createdAt: true,
        },
      });

      this.logger.log(`User registered: ${newUser.email}`);
      return {
        success: true,
        message: 'User registered successfully',
        user: newUser,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(`Registration failed: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to register user');
    }
  }
}