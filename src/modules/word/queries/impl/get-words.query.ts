import { GetWordsRequestDto } from "../../dto/get-words.request.dto";

export class GetWordsQuery {
    constructor(
        public readonly userId: string,
        public readonly getWordsRequestDto: GetWordsRequestDto,
    ) {}
}