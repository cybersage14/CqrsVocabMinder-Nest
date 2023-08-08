import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';

import { PasswordTransformer } from '../common/helper/password.transformer';
import BaseModel from './base.model';
import { WordsBoxEntity } from './wordsBox.entity';
import { BoxEntity } from './box.entity';
import { WordEntity } from './word.entity';
import { IsUnique } from '@src/common/validator/unique.validator';

@Entity({
  name: 'user',
})
export class UserEntity extends BaseModel {
  @Column({ length: 255 })
  firstName: string;

  @Column({ length: 255 })
  lastName: string;
  // @IsUnique({ always: true, message: 'username already exists' })
  @Column({ length: 255 })
  email: string;

  @Column({
    name: 'password',
    length: 255,
    // this is for the password encryption
    transformer: new PasswordTransformer(),
  })
  password: string;

   // exclude password from the response
   toJSON() {
    const { password, ...self } = this;
    return self;
  }

  /* -------------------------------------------------------------------------- */
  /*                                foreign key                                */
  /* -------------------------------------------------------------------------- */

  @OneToMany(() => BoxEntity, (box) => box.user,)
  box: BoxEntity[]

  @OneToMany(() => WordsBoxEntity, (wordsBox) => wordsBox.user)
  wordsBoxes: WordsBoxEntity[];

  @OneToMany(() => WordEntity, (word) => word.user)
  words: WordEntity[];
}
