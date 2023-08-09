import { CreateBoxRequestDto } from "../../dto";

export class CreateBoxCommand {
    constructor(
        public readonly userId: string,
        public readonly createBoxRequestDto: CreateBoxRequestDto
    ){}
}