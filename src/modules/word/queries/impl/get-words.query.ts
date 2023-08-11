import { IQuery } from "@nestjs/cqrs";
import { GetWordsRequestDto } from "../../dto/get-words.request.dto";

export class GetWordsQuery implements IQuery{
    constructor(
        public readonly userId: string,
        public readonly getWordsRequestDto: GetWordsRequestDto,
    ) {}
}