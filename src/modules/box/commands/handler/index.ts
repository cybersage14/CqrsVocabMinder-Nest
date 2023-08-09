import { AddWordsBoxesToBoxHandler } from './add-WordsBoxes-to-box.handler'
import { CreateBoxHandler } from './create-box.handler'

export * from './create-box.handler'
export * from './add-WordsBoxes-to-box.handler'

export const CommandHandler =[CreateBoxHandler,AddWordsBoxesToBoxHandler]