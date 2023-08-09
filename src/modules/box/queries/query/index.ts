import { getBoxHandler } from './get-box.handler'
import { GetBoxesHandler } from './get-boxes.handler'

export * from './get-boxes.handler'

export const QueryHandler = [GetBoxesHandler,getBoxHandler]
