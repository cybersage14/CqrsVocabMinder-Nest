import { ICommand } from "@nestjs/cqrs";
import { UpdateWordRequestDto } from "../../dto/update-word.request.dto";

export class UpdateWordCommand implements ICommand {
    constructor(
        public readonly wordId: string,
        public readonly userId:string,
        public readonly updateWordRequestDto : UpdateWordRequestDto
    ){}
}