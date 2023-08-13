import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Hash } from '../../common/utils/Hash';
import { ConfigService } from '../../config';
import { UsersService } from './../user';
import { LoginRequestDto } from './dto/login.request.dto';
import { UserEntity } from '../../entities';
import { CustomError, USER_NOT_FOUND } from '@src/common/errors';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) { }

  async createToken(user: UserEntity) {
    console.log(user);
    return {
      expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
      accessToken: this.jwtService.sign({ id: user.id, username: user.firstName }),
      user,
    };
    
  }

  async validateUser(payload: LoginRequestDto): Promise<any> {
    const user = await this.userService.getUserByEmail(payload.email);
    if (!user) throw new CustomError(USER_NOT_FOUND)

    const isMatch = await Hash.compare(payload.password, user.password)
    
    if (!user || !isMatch) {
      throw new UnauthorizedException('Invalid credentials!');
    }
    return user;
  }
}
