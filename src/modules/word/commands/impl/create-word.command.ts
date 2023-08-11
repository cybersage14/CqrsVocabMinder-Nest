import { ICommand } from "@nestjs/cqrs";
import { CreateWordRequestDto } from "../../dto";

export class CreateWordCommand  implements ICommand{
    constructor(
        public readonly userId: string,
        public readonly createWordRequestDto : CreateWordRequestDto
    ){}
}