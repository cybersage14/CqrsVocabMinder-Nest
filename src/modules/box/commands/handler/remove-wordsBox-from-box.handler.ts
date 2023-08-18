import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RemoveWordsBoxFromBoxCommand } from "../impl";
import { CustomError, BOX_NOT_FOUND } from "@src/common/errors";
import { GetUser } from "@src/modules/shared/functions";
import { GetBox } from "@src/modules/shared/functions/box.handler";
import { QueryRunner, DataSource } from "typeorm";

@CommandHandler(RemoveWordsBoxFromBoxCommand)
export class RemoveWordsBoxFromBoxHandler implements ICommandHandler<RemoveWordsBoxFromBoxCommand> {
    queryRunner: QueryRunner;
    constructor(private dataSource: DataSource) { }
    async execute(command: RemoveWordsBoxFromBoxCommand): Promise<any> {
        const { boxId, userId,removeWordsBoxFromBoxRequestDto } = command
        const {wordsBoxIds}= removeWordsBoxFromBoxRequestDto
        this.queryRunner = this.dataSource.createQueryRunner()
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

            await this.queryRunner.commitTransaction()

        } catch (err) {
            await this.queryRunner.rollbackTransaction()
            throw err
        } finally {
            await this.queryRunner.release();
        }
    }
}