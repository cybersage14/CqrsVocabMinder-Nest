import { GetBoxesRequestDto } from "../../dto";

export class GetBoxesCommand {
    constructor(
        public readonly userId: string,
        public readonly getBoxesRequestDto:GetBoxesRequestDto
    ){}
}