import { ICommand } from "@nestjs/cqrs";
import { AddWordsBoxesToBoxRequestDto } from "../../dto";

export class AddWordsBoxesToBoxCommand implements ICommand {
    constructor(
        public readonly boxId: string,
        public readonly userId:string,
        public readonly createBoxRequestDto: AddWordsBoxesToBoxRequestDto
    ){}
}