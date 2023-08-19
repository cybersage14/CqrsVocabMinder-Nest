import { AddWordsBoxesToBoxHandler } from './add-WordsBoxes-to-box.handler'
import { CreateBoxHandler } from './create-box.handler'
import { DeleteBoxHandler } from './delete-box.handler'
import { RemoveWordsBoxFromBoxHandler } from './remove-wordsBox-from-box.handler'
import { UpdateBoxHandler } from './update-box.handler'

export * from './create-box.handler'
export * from './add-WordsBoxes-to-box.handler'
export * from './delete-box.handler'
export * from './remove-wordsBox-from-box.handler'
export * from './update-box.handler'
export const CommandHandler = [CreateBoxHandler,AddWordsBoxesToBoxHandler,DeleteBoxHandler,RemoveWordsBoxFromBoxHandler,UpdateBoxHandler]