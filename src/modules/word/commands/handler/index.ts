import { CreateWordHandler } from "./create-word.handler";
import { DeleteWordHandler } from "./delete-word.handler";
import { UpdateWord } from "./update-word.handler";

export * from "./create-word.handler";
export * from "./update-word.handler";
export * from "./delete-word.handler";



export const CommandHandler = [CreateWordHandler,UpdateWord,DeleteWordHandler]