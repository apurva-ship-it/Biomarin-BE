import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status === 'inactive') {
      throw new UnauthorizedException('Your account is inactive. Contact your administrator.');
    }

    const isPasswordValid = user.passwordHash
      ? await bcrypt.compare(password, user.passwordHash)
      : false;

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName || `${user.firstName} ${user.lastName}`,
        role: user.role,
        avatarUrl: user.avatarUrl,
        title: user.title,
        department: user.department,
        location: user.location,
        availabilityStatus: user.availabilityStatus,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName, title, department } = registerDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        displayName: `${firstName} ${lastName}`,
        title,
        department,
        role: 'viewer',
        status: 'active',
      },
    });

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        role: user.role,
        avatarUrl: user.avatarUrl,
        title: user.title,
        department: user.department,
      },
    };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        skills: true,
        interests: true,
        tools: true,
        _count: {
          select: {
            notifications: { where: { isRead: false } },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.displayName || `${user.firstName} ${user.lastName}`,
      role: user.role,
      status: user.status,
      avatarUrl: user.avatarUrl,
      title: user.title,
      department: user.department,
      location: user.location,
      availabilityStatus: user.availabilityStatus,
      teamsHandle: user.teamsHandle,
      bio: user.bio,
      phone: user.phone,
      skills: user.skills,
      interests: user.interests,
      tools: user.tools,
      unreadNotifications: user._count.notifications,
      lastLoginAt: user.lastLoginAt,
    };
  }

  async logout(userId: string) {
    return { message: 'Logged out successfully' };
  }
}
