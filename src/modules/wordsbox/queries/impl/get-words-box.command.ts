import { IQuery } from "@nestjs/cqrs";
import { GetWordsRequestDto } from "../../dto";

export class GetWordsBoxQuery implements IQuery {
    constructor(
        public readonly userId: string,
        public readonly getWordsRequestDto:GetWordsRequestDto
    ) { }
}