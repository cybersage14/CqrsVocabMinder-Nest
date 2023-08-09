import { AddWordsBoxesToBoxRequestDto } from "../../dto";

export class AddWordsBoxesToBoxCommand {
    constructor(
        public readonly boxId: string,
        public readonly createBoxRequestDto: AddWordsBoxesToBoxRequestDto
    ){}
}