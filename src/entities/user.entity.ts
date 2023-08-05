import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

import { PasswordTransformer } from '../common/helper/password.transformer';
import BaseModel from './base.model';
import { WordsBoxEntity } from './wordsBox.entity';

@Entity({
  name: 'users',
})
export class UserEntity  extends BaseModel  {
  @Column({ length: 255 })
  firstName: string;

  @Column({ length: 255 })
  lastName: string;

  @Column({ length: 255 })
  email: string;

  @Column({
    name: 'password',
    length: 255,
    transformer: new PasswordTransformer(),
  })
  password: string;

  toJSON() {
    const { password, ...self } = this;
    return self;
  }
}
