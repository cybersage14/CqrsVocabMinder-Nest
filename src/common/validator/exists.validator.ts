// import { Injectable } from '@nestjs/common';
// import { InjectConnection, InjectQueryRunner } from '@nestjs/typeorm';
// import { Connection, EntitySchema, ObjectType, QueryRunner } from 'typeorm';
// import {
//   ValidatorConstraint,
//   ValidatorConstraintInterface,
//   ValidationArguments,
//   ValidationOptions,
//   registerDecorator,
// } from 'class-validator';

// @Injectable()
// @ValidatorConstraint({ name: 'exists', async: true })
// export class ExistsValidator implements ValidatorConstraintInterface {
//   constructor(
//     @InjectConnection() private readonly connection: Connection,
//     @InjectQueryRunner() private readonly queryRunner: QueryRunner,
//   ) {}

//   public async validate<E>(value: string, args: ExistsValidationArguments<E>) {
//     const [EntityClass, findCondition = args.property] = args.constraints;
//     const queryRunner = this.queryRunner;
    
//     const count = await queryRunner.query(
//       `SELECT COUNT(*) FROM ${EntityClass.name} WHERE ${
//         typeof findCondition === 'function'
//           ? findCondition(args)
//           : `${findCondition || args.property} = '${value}'`
//       }`,
//     );

//     return count > 0;
//   }

//   defaultMessage(args: ValidationArguments) {
//     const [EntityClass] = args.constraints;
//     const entity = EntityClass.name || 'Entity';
//     return `The selected ${args.property} does not exist in ${entity} entity`;
//   }
// }

// type ExistsValidationConstraints<E> = [
//   ObjectType<E> | EntitySchema<E> | string,
//   ((validationArguments: ValidationArguments) => string) | keyof E,
// ];
// interface ExistsValidationArguments<E> extends ValidationArguments {
//   constraints: ExistsValidationConstraints<E>;
// }

// export function Exists<E>(
//   constraints: Partial<ExistsValidationConstraints<E>>,
//   validationOptions?: ValidationOptions,
// ) {
//   return function (object: Object, propertyName: string) {
//     registerDecorator({
//       target: object.constructor,
//       propertyName: propertyName,
//       options: validationOptions,
//       constraints,
//       validator: ExistsValidator,
//     });
//   };
// }