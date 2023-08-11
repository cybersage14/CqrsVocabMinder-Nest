import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../entities';
import { RegisterRequestDto } from '../auth';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getUserById(id: string) {
    return this.userRepository.findOne({ where:{
      id: id
    } });
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.findOne({ where: {
      email
    }});
  }

  async createUser(registerRequestDto: RegisterRequestDto ) {
    const {email,firstName,lastName,password} = registerRequestDto
    const user = await this.getUserByEmail(registerRequestDto.email);
    if (user) {
      throw new NotAcceptableException(
        'User with provided email already created.',
      );
    }
    return  await this.userRepository.save({lastName,firstName,email,password});
  }
}
