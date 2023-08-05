export * from './user.entity'
export * from './box.entity'
export * from './word.entity'
export * from './wordsBox.entity'

import { BoxEntity } from './box.entity';
import { UserEntity } from './user.entity';
import { WordEntity } from './word.entity';
import { WordsBoxEntity } from './wordsBox.entity';

export const entities = [UserEntity,BoxEntity,WordEntity,WordsBoxEntity];
