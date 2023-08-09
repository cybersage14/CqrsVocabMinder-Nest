import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { getBoxCommand } from "../impl/get-box.command";

@QueryHandler(getBoxCommand)
export class getBoxHandler implements IQueryHandler<getBoxCommand> {
    execute(query: getBoxCommand): Promise<any> {
        const { } = query
        throw new Error("Method not implemented.");
    }
}