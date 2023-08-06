import {
    Entity,
    Column,
    JoinTable,
    OneToMany,
    ManyToOne,
    JoinColumn,
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

    /* -------------------------------------------------------------------------- */
    /*                                 Foreign key                                */
    /* -------------------------------------------------------------------------- */

    @ManyToOne(() => UserEntity)
    // @JoinColumn({ name: 'words_box_id', referencedColumnName: 'id', })
    wordsBoxes: WordsBoxEntity[];

    @ManyToOne(() => UserEntity)
    // @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: UserEntity
}
