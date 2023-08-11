import { IQuery } from "@nestjs/cqrs";

export class getBoxDetailCommand implements IQuery {
    constructor(
        public readonly userId :string,
        public readonly boxId: string,
    ) {}
}