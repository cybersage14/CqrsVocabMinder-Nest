import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteBoxCommand } from "../impl";
import { DataSource, QueryRunner } from "typeorm";
import { GetUser } from "@src/modules/shared/functions";
import { GetBox } from "@src/modules/shared/functions/box.handler";
import { CustomError, BOX_NOT_FOUND } from "@src/common/errors";
import { BoxEntity } from "@src/entities";

@CommandHandler(DeleteBoxCommand)
export class DeleteBoxHandler implements ICommandHandler<DeleteBoxCommand> {
    queryRunner: QueryRunner;
    constructor(private dataSource: DataSource) { }
    async execute(command: DeleteBoxCommand) {
        this.queryRunner = this.dataSource.createQueryRunner()
        const { boxId, userId } = command
        try {
            /* -------------------------------------------------------------------------- */
            /*                              start Transaction                             */
            /* -------------------------------------------------------------------------- */
            await this.queryRunner.connect();
            await this.queryRunner.startTransaction();
            const manager = this.queryRunner.manager;
            /* -------------------------------- get user -------------------------------- */
            const user = await GetUser(manager, { id: userId })
            /* --------------------------------- get box -------------------------------- */
            const getBox = await GetBox(manager, {
                id: boxId,
                user: {
                    id: user.id
                }
            })
            if (!getBox) {
                throw new CustomError(BOX_NOT_FOUND)
            }
            /* ------------------------------- delete box ------------------------------- */
            await this.queryRunner.manager.remove(BoxEntity, getBox)
            await this.queryRunner.commitTransaction()
            return {
                is_deleted: true,
                id:boxId,
            }
        } catch (error) {
            await this.queryRunner.rollbackTransaction()
            throw error
        } finally {
            await this.queryRunner.release();
        }
    }
}