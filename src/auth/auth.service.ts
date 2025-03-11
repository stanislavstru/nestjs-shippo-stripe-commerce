import {
  Injectable,
  // UnauthorizedException
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { users } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { Role } from './roles/roles.enum';
import { UsersService } from '_entity/users/users.service';
// import { v4 as uuid } from 'uuid';

type JWTTokenGenerateType = {
  id: string;
  email: string;
  roles: (Role | string)[];
};

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<users | null> {
    const user = (
      await this.prisma.users.findUnique({
        where: {
          email: username,
        },
      })
    )[0];
    if (user && user.password === password) return user;
    return null;
  }

  async generateJWTToken(user: JWTTokenGenerateType) {
    const accessToken = await this.createAccessToken(user);

    const jwtToken = {
      access_token: accessToken,
      role: user.roles,
    };

    console.log('jwtToken', jwtToken);

    return jwtToken;
  }

  async createAccessToken(user: JWTTokenGenerateType) {
    return this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        roles: user.roles,
      },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRE_TIME,
      },
    );
  }

  // async createRefreshToken(userId: string) {
  //   const tokenId = uuid();
  //   return this.jwtService.sign(
  //     { id: userId, tokenId: tokenId },
  //     { expiresIn: '7d' },
  //   );
  // }

  async googleLogin(req) {
    try {
      let user = await this.usersService.findUnique({
        where: { email: req.user.email },
      });

      if (!user) {
        const newUser = await this.usersService.createUser({
          email: req.user.email,
          first_name: req.user.first_name,
          last_name: req.user.last_name,
          picture: req.user.picture,
          roles: [Role.CUSTOMER],
        });

        if (!newUser) throw new Error('User was not created');

        console.log(`User created: ${newUser.email}`);

        user = newUser;
      } else {
        console.log(`User found: ${user.email}`);
      }

      const foundSessions = await this.prisma.oauth_sessions.findFirst({
        where: {
          session_id: req.user.session_id,
        },
      });

      if (!foundSessions) {
        await this.prisma.oauth_sessions.create({
          data: {
            user_id: user.id,
            session_id: req.user.session_id,
            provider_type: 'google',
            access_token: req.user.access_token,
            refresh_token: req.user.refresh_token,
            access_expires_at: new Date(),
          },
        });
      }

      return this.generateJWTToken({
        id: user.id,
        email: user.email,
        roles: user.roles,
      });
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
}
