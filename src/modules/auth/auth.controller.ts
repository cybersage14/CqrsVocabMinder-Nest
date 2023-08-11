import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService, LoginRequestDto, RegisterRequestDto } from './';
import { CurrentUser } from '../../common/decorator/current-user.decorator';
import { UsersService } from './../user';
import { UserEntity } from '../../entities';
import { JwtAuthGuard } from './../../common/guard/jwt-guard';

@Controller('/auth')
@ApiTags('authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('login')
  @ApiResponse({ status: 201, description: 'Successful Login' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() loginRequestDto: LoginRequestDto): Promise<any> {
    const user = await this.authService.validateUser(loginRequestDto);
    return await this.authService.createToken(user);
  }

  @Post('register')
  @ApiResponse({ status: 201, description: 'Successful Registration' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async register(@Body() registerRequestDto: RegisterRequestDto): Promise<any> {
    const user = await this.userService.createUser(registerRequestDto);
    return await this.authService.createToken(user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getLoggedInUser(@CurrentUser() user: UserEntity): Promise<UserEntity> {
    return user;
  }
}
