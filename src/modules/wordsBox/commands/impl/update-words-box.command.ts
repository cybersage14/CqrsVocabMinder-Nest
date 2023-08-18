import { ICommand } from "@nestjs/cqrs";
import { UpdateWordsBoxRequestDto } from "../../dto";

export class UpdateWordsBoxCommand implements ICommand {
    constructor(
        public readonly userId: string,
        public readonly boxId: string,
        public readonly updateWordsBoxRequestDto: UpdateWordsBoxRequestDto
    ){}
}