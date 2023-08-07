import {
    Entity,
    Column,
    ManyToOne,
} from 'typeorm';

import BaseModel from './base.model';
import { WordsBoxEntity } from './wordsBox.entity';
import { UserEntity } from './user.entity';

@Entity({
    name: 'word',
})
export class WordEntity extends BaseModel {

    @Column({ type: 'varchar', name: 'word', })
    word: string;

    @Column({ type: 'varchar', name: 'definition' })
    definition: string;

    @Column({ type: 'varchar', name: 'usage' })
    usage: string;

    @Column({ type: 'varchar', name: 'pronounce' })
    pronounce: string;

    @Column({ type: 'varchar', name: 'example' })
    example: string;

    /* -------------------------------------------------------------------------- */
    /*                                 Foreign key                                */
    /* -------------------------------------------------------------------------- */

    @ManyToOne(() => WordsBoxEntity, (wordsBox) => wordsBox.words,)
    wordsBoxes: WordsBoxEntity[];

    @ManyToOne(() => UserEntity, (user) => user.words, { cascade: true})
    user: UserEntity
}
