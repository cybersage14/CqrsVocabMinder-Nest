import { IQuery } from "@nestjs/cqrs";

export class getWordsBoxDetailQuery implements IQuery {
    constructor(
        public readonly userId: string,
        public readonly boxId: string,
    ) { }
}