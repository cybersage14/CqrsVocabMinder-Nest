import {
    Entity,
    Column,
    ManyToMany,
    JoinTable,
    ManyToOne,
    OneToMany,
} from 'typeorm';

import BaseModel from './base.model';
import { WordsBoxEntity } from './wordsBox.entity';

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

    /* -------------------------------------------------------------------------- */
    /*                                 Foreign key                                */
    /* -------------------------------------------------------------------------- */

    @OneToMany(() => WordsBoxEntity, (word) => word.words)
    @JoinTable()
    wordsBoxes: WordsBoxEntity[];
}
