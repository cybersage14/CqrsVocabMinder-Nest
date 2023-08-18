import { AddWordToBoxHandler } from './add-words-to-box.handler'
import { CreateWordsBoxHandler } from './create-words-box.handler'
import { DeleteWordsBoxHandler } from './delete-words-box.handler'
import { RemoveWordsHandler } from './remove-words.handler'
import { UpdateWordsBoxHandler } from './update-words-box.handler'

export * from './create-words-box.handler'
export * from './add-words-to-box.handler'


export const CommandHandler = [CreateWordsBoxHandler, AddWordToBoxHandler, DeleteWordsBoxHandler, RemoveWordsHandler, UpdateWordsBoxHandler]