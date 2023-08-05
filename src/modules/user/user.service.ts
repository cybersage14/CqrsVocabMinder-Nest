import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'entities';
import { RegisterRequestDto } from 'modules/auth';
import { Repository } from 'typeorm';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getUserById(id: number) {
    return this.userRepository.findOne({ id });
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.findOne({ email });
  }

  async createUser(registerRequestDto: RegisterRequestDto ) {
    const user = await this.getUserByEmail(registerRequestDto.email);

    if (user) {
      throw new NotAcceptableException(
        'User with provided email already created.',
      );
    }

    return await this.userRepository.save(registerRequestDto);
  }
}
