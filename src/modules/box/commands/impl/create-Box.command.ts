import { ICommand } from "@nestjs/cqrs";
import { CreateBoxRequestDto } from "../../dto";

export class CreateBoxCommand implements ICommand {
    constructor(
        public readonly userId: string,
        public readonly createBoxRequestDto: CreateBoxRequestDto
    ){}
}