import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Hash } from '../../common/utils/Hash';
import { ConfigService } from '../../config';
import {  UsersService } from './../user';
import { LoginRequestDto } from './dto/login.request.dto';
import { UserEntity } from '../../entities';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {}

  async createToken(user: UserEntity) {
    return {
      expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
      accessToken: this.jwtService.sign({ id: user.id,username: user.firstName }),
      user,
    };
  }

  async validateUser(payload: LoginRequestDto): Promise<any> {
    const user = await this.userService.getUserByEmail(payload.email);
    console.log(user);
    console.log(payload);
    
    const isMatch = await Hash.compare(payload.password, user.password)
      console.log(isMatch);
      
    if (!user || !isMatch) {
      throw new UnauthorizedException('Invalid credentials!');
    }
    return user;
  }
}
