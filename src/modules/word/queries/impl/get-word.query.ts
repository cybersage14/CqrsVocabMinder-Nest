import { IQuery } from "@nestjs/cqrs";

export class GetWordQuery  implements IQuery{
    constructor(
        public readonly userId: string,
        public readonly wordId: string
    ) { }
}