import { ICommand } from "@nestjs/cqrs";

export class DeleteWordCommand implements ICommand{
    constructor(
        public readonly userId :string,
        public readonly wordId :string
    ){}
}