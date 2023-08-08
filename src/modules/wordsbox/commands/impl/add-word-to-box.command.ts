import { AddWordToBoxRequestDto } from "../../dto";

export class AddWordToBox {
    constructor(
       public readonly userId: string,
       public readonly boxId: string,
       public readonly addWordToBoxRequestDto: AddWordToBoxRequestDto
    ) {}
}