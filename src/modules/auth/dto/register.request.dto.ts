import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
// import { Unique } from '../../../common';
import { SameAs } from '../../../common/validator/same-as.validator';
import { UserEntity } from '@src/entities';
import { IsUnique } from '@src/common/validator/unique.validator';

export class RegisterRequestDto {
  @ApiProperty({
    required: true,
  })
  @IsEmail()
  // @IsUnique({ always: true, message: 'email already exists' })
  email: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @MinLength(5)
  password: string;

  @ApiProperty({ required: true })
  @SameAs('password')
  passwordConfirmation: string;
}
