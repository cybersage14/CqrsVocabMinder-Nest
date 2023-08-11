import { ICommand } from "@nestjs/cqrs";
import { AddWordToBoxRequestDto } from "../../dto";

export class AddWordToBox implements ICommand {
    constructor(
       public readonly userId: string,
       public readonly boxId: string,
       public readonly addWordToBoxRequestDto: AddWordToBoxRequestDto
    ) {}
}