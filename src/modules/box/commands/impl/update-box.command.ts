import { ICommand } from "@nestjs/cqrs";
import { UpdateBoxRequestDto } from "../../dto";

export class UpdateBoxCommand implements ICommand {
    constructor(
        public readonly userId: string,
        public readonly boxId: string,
        public readonly updateBoxRequestDto: UpdateBoxRequestDto
    ){}
}