import { HttpException, HttpStatus } from '@nestjs/common';

export interface ICustomError {
  status: number;
  description: string;
  id?: string;
}

export class CustomError extends HttpException {
  constructor({ description, status }: ICustomError) {
    super(description, status);
  }
}
export const INTERNAL_SERVER_ERROR: ICustomError = {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'internal server error',
  };

export const USER_NOT_FOUND : ICustomError = {
    status:HttpStatus.NOT_FOUND,
    description:'user not found'
}
export const WORDS_BOX_NOT_FOUND : ICustomError = {
  status:HttpStatus.NOT_FOUND,
  description:'words box not found'
}

export const WORDS_BOX_ALREADY_EXISTS : ICustomError = {
  description: "word already exists",
  status: HttpStatus.CONFLICT,
}

export const BOX_ALREADY_EXISTS : ICustomError = {
  description: "box already exists",
  status: HttpStatus.CONFLICT,
}

export const BOX_NOT_FOUND : ICustomError = {
  description: "box not found",
  status: HttpStatus.NOT_FOUND,
}
export const WORD_NOT_FOUND : ICustomError = {
  description: "word not found",
  status: HttpStatus.NOT_FOUND,
}
export const WORD_NOT_YOUR_BOX : ICustomError = {
  description: "this word is not your box",
  status: HttpStatus.NOT_FOUND,
}
export const WORDS_BOX_NOT_IN_YOUR_BOX : ICustomError = {
  description: "this words box is not in your box",
  status: HttpStatus.NOT_FOUND,
}