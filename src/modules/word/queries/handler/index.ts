export * from "./get-words.handler";
import { GetWordHandler } from "./get-word.handler";
import { GetWordsHandler } from "./get-words.handler";

export const QueryHandler = [GetWordsHandler,GetWordHandler]