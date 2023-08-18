import { ICommand } from "@nestjs/cqrs";
import { RemoveWordsRequestDto } from "../../dto";

export class RemoveWordsCommand implements ICommand {
    constructor(
        public readonly userId: string,
        public readonly boxId: string,
        public readonly removeWordsRequestDto: RemoveWordsRequestDto
    ) { }
} 