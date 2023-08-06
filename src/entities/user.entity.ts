import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

import { PasswordTransformer } from '../common/helper/password.transformer';
import BaseModel from './base.model';
import { WordsBoxEntity } from './wordsBox.entity';
import { BoxEntity } from './box.entity';
import { WordEntity } from './word.entity';

@Entity({
  name: 'user',
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

  @OneToMany(()=>BoxEntity,(box)=>box.user)
  boxes: BoxEntity[]

  @OneToMany(()=>WordsBoxEntity,(wordsBox)=>wordsBox.user)
  wordsBoxes: WordsBoxEntity[];
  
  toJSON() {
    const { password, ...self } = this;
    return self;
  }
}
