import { AddWordToBoxHandler } from './add-word-to-box.handler'
import { CreateWordsBoxHandler } from './create-words-box.handler'

export * from './create-words-box.handler'
export * from './add-word-to-box.handler'


export const CommandHandler =[CreateWordsBoxHandler,AddWordToBoxHandler]