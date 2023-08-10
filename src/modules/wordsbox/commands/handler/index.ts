import { AddWordToBoxHandler } from './add-words-to-box.handler'
import { CreateWordsBoxHandler } from './create-words-box.handler'
import { WordsBoxHandler } from './delete-words-box.handler'

export * from './create-words-box.handler'
export * from './add-words-to-box.handler'


export const CommandHandler =[CreateWordsBoxHandler,AddWordToBoxHandler,WordsBoxHandler]