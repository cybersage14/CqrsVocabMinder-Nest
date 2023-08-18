import { ICommand } from "@nestjs/cqrs";

export class DeleteBoxCommand implements ICommand {
    constructor(
        public readonly userId: string,
        public readonly boxId: string
    ){}
}