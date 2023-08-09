import { UpdateWordRequestDto } from "../../dto/update-word.request.dto";

export class UpdateWordCommand {
    constructor(
        public readonly id: string,
        public readonly updateWordRequestDto : UpdateWordRequestDto
    ){}
}