export class DeleteWordsBoxCommand {
    constructor(
        public readonly userId: string,
        public readonly wordsBoxId: string
    ) { }
}