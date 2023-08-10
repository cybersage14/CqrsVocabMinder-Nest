import {
    Entity,
    Column,
    ManyToOne,
    ManyToMany,
    Unique,
    JoinTable,
    OneToMany,
    JoinColumn,
} from 'typeorm';

import BaseModel from './base.model';
import { UserEntity } from './user.entity';
import { WordEntity } from './word.entity';
import { BoxEntity } from './box.entity';

@Entity({
    name: 'words_box'
})
@Unique('word_box_unique', ['name'])
export class WordsBoxEntity extends BaseModel {

    @Unique('word_box_unique', ['name'])
    @Column({ name: 'name', type: 'varchar', unique: true, nullable: false })
    name: string;

    @Column({ default: false, name: 'is_learned' })
    is_learned: boolean;

    @Column({ type: 'timestamp', nullable: true })
    last_reviewed_date: Date;

    /* -------------------------------------------------------------------------- */
    /*                                 Foreign key                                */
    /* -------------------------------------------------------------------------- */

    @OneToMany(() => WordEntity, (word) => word.wordsBoxes, { cascade: true })
    @JoinColumn({ name: 'wordsBoxesId' })
    words: WordEntity[];

    @ManyToOne(() => UserEntity, (user) => user.wordsBoxes, { cascade: true })
    user: UserEntity;

    @ManyToOne(() => BoxEntity, (box) => box.wordsBoxes, { cascade: true, })
    Box: BoxEntity

    markWordAsLearned(): void {
        this.is_learned = true;
        this.last_reviewed_date = new Date();
    }
}
