import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { UserEntity } from './user.entity';
import { WordsBoxEntity } from './wordsBox.entity';
import BaseModel from './base.model';

@Entity({ name: 'box' })
export class BoxEntity extends BaseModel {

  @Column({ name: 'name', type: 'varchar', unique: true })
  name: string;

  /* -------------------------------------------------------------------------- */
  /*                                 Foreign key                                */
  /* -------------------------------------------------------------------------- */

  @ManyToOne(() => UserEntity, (user) => user.box, { cascade: true })
  user: UserEntity;

  @ManyToMany(() => WordsBoxEntity, (wordsBox) => wordsBox.Box,)
  @JoinTable({ name: 'wordsBox' })
  wordsBoxes: WordsBoxEntity[];
}