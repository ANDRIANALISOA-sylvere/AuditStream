import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'generated/prisma/client';
import * as bcrypt from 'bcrypt';

const DEFAULT_PASSWORD = 'auditstream@2026';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUser(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async createUser(data: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    return existingUser;
  }

  async updateUserProfile(
    id: number,
    data: { username?: string; picture?: string | null },
  ): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    return this.prisma.user.update({
      where: { id },
      data: {
        username: data.username !== undefined ? data.username : user.username,
        picture: data.picture !== undefined ? data.picture : user.picture,
      },
    });
  }

  async validatePassword(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.findUserByEmail(email);
    if (!user || !user.password) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : null;
  }
}
