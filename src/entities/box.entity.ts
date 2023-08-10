import { Entity, Column, ManyToOne, ManyToMany, JoinTable, Unique, JoinColumn, OneToMany } from 'typeorm';
import { UserEntity } from './user.entity';
import { WordsBoxEntity } from './wordsBox.entity';
import BaseModel from './base.model';

@Entity({ name: 'box' })
export class BoxEntity extends BaseModel {

  @Column({ name: 'name', type: 'varchar',})
  name: string;
  /* -------------------------------------------------------------------------- */
  /*                                 Foreign key                                */
  /* -------------------------------------------------------------------------- */

  @ManyToOne(() => UserEntity, (user) => user.box, { cascade: true, onDelete:'CASCADE' })
  @JoinColumn({ name: 'user_id',}) 
  user: UserEntity;

  @OneToMany(() => WordsBoxEntity, (wordsBox) => wordsBox.Box)
  @JoinTable({ name: 'box_words' })
  wordsBoxes: WordsBoxEntity[];
}