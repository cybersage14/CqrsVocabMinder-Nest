import { Entity, Column, ManyToOne, JoinColumn, BaseEntity, ManyToMany } from 'typeorm';
import { UserEntity } from './user.entity';
import { WordsBoxEntity } from './wordsBox.entity';
import BaseModel from './base.model';

@Entity({ name: 'box' })
export class BoxEntity extends BaseModel {

  @Column({name: 'name', type: 'varchar'})
  name: string;

  /* -------------------------------------------------------------------------- */
  /*                                 Foreign key                                */
  /* -------------------------------------------------------------------------- */

  @ManyToOne(() => UserEntity,)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToMany(() => WordsBoxEntity, (wordsBox) => wordsBox.Box)
  @JoinColumn({ name: 'words_box_id', referencedColumnName: 'id' })
  wordsBoxes: WordsBoxEntity[];
}