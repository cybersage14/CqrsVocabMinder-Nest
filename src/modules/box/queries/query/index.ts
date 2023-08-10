import { getBoxDetailHandler } from './get-box-detail.handler'
import { GetBoxesHandler } from './get-boxes.handler'

export * from './get-boxes.handler'

export const QueryHandler = [GetBoxesHandler,getBoxDetailHandler]
