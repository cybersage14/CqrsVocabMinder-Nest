import { ICommand } from "@nestjs/cqrs";

export class DeleteWordsBoxCommand implements ICommand {
    constructor(
        public readonly userId: string,
        public readonly wordsBoxId: string
    ) { }
}