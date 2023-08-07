import { CreateWordsBoxRequestDto } from "../../dto";

export class CreateWordsBoxCommand{
 constructor(
    public readonly userId: string,
    public readonly createWordsBoxRequestDto: CreateWordsBoxRequestDto
 ){

 }
}