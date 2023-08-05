import {
    Entity,
    Column,
    JoinColumn,
    ManyToOne,
    ManyToMany,
} from 'typeorm';

import BaseModel from './base.model';
import { UserEntity } from './user.entity';
import { WordEntity } from './word.entity';
import { BoxEntity } from './box.entity';

@Entity({
    name: 'words_box',
})
export class WordsBoxEntity extends BaseModel {

    @Column({ name: 'name', type: 'varchar' })
    name: string;

    @Column()
    wordsBox: string;

    @Column({ default: false , name: 'is_learned' })
    is_learned: boolean;

    @Column({ type: 'timestamp', nullable: true })
    last_reviewed_date: Date;

    /* -------------------------------------------------------------------------- */
    /*                                 Foreign key                                */
    /* -------------------------------------------------------------------------- */

    @ManyToOne(() => WordEntity)
    @JoinColumn({ name: 'word_id', referencedColumnName: 'id' })
    words: WordEntity[];

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: UserEntity;

    @Column({ name: 'user_id',type:'uuid' })
    userId: UserEntity

    @ManyToMany(() => BoxEntity, (box) => box.wordsBoxes)
    Box: BoxEntity[]

    markWordAsLearned(): void {
        this.is_learned = true;
        this.last_reviewed_date = new Date();
    }
}
