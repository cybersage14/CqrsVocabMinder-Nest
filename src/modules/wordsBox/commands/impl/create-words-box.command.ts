import { ICommand } from "@nestjs/cqrs";
import { CreateWordsBoxRequestDto } from "../../dto";

export class CreateWordsBoxCommand implements ICommand{
 constructor(
    public readonly userId: string,
    public readonly createWordsBoxRequestDto: CreateWordsBoxRequestDto
 ){

 }
}