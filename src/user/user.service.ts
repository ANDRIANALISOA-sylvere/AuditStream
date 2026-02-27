import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'generated/prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create({ data });
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
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        username: data.username !== undefined ? data.username : user.username,
        picture: data.picture !== undefined ? data.picture : user.picture,
      },
    });
  }
}
