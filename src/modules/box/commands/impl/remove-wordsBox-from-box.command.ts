import { ICommand } from "@nestjs/cqrs";
import { RemoveWordsBoxFromBoxRequestDto } from "../../dto";

export class RemoveWordsBoxFromBoxCommand implements ICommand{
    constructor(
        public readonly boxId: string ,
        public readonly userId: string,
        public readonly removeWordsBoxFromBoxRequestDto: RemoveWordsBoxFromBoxRequestDto
    ) {}
}