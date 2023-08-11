import { IQuery } from "@nestjs/cqrs";
import { GetBoxesRequestDto } from "../../dto";

export class GetBoxesCommand implements IQuery {
    constructor(
        public readonly userId: string,
        public readonly getBoxesRequestDto:GetBoxesRequestDto
    ){}
}