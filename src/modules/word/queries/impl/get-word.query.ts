
export class GetWordQuery {
    constructor(
        public readonly userId: string,
        public readonly wordId: string
    ) { }
}