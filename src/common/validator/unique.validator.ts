import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DataSource } from 'typeorm';

@ValidatorConstraint({ name: 'isUnique', async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private dataSource: DataSource) {}
  validate(value: any, args: ValidationArguments) {
    return this.dataSource
      .getRepository(args.targetName)
      .findOne({
        where: {
          [args.property]: value,
        },
      })
      .then((entity) => {
        if (entity) return false;
        return true;
      });
  }
}

export function IsUnique(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUniqueConstraint,
    });
  };
}