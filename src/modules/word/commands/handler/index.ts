import { CreateWordHandler } from "./create-word.handler";
import { UpdateWord } from "./update-word.handler";

export * from "./create-word.handler";

export const CommandHandler = [CreateWordHandler,UpdateWord]