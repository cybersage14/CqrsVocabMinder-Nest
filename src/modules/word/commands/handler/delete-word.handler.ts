import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteWordCommand } from "../impl";
import { DataSource, QueryRunner } from "typeorm";
import { GetWord } from "@src/modules/shared/functions/word.helper";
import { CustomError, WORD_NOT_FOUND } from "@src/common/errors";

@CommandHandler(DeleteWordCommand)
export class DeleteWordHandler implements ICommandHandler<DeleteWordCommand> {
    queryRunner: QueryRunner
    constructor(
        private dataSource: DataSource
    ) { }
    async execute(command: DeleteWordCommand): Promise<any> {
        this.queryRunner = this.dataSource.createQueryRunner()
        const { userId, wordId } = command
        try {
            /* -------------------------------------------------------------------------- */
            /*                              start transaction                             */
            /* -------------------------------------------------------------------------- */
            await this.queryRunner.connect()
            await this.queryRunner.startTransaction()
            /* -------------------------------- get word -------------------------------- */
            const word = await GetWord(this.queryRunner.manager, {
                id: wordId,
                user: {
                    id: userId
                }
            })
            if (!word) {
                throw new CustomError(WORD_NOT_FOUND)
            }

            /* ------------------------------- delete word ------------------------------ */
            await this.queryRunner.manager.remove(word)
            await this.queryRunner.commitTransaction()

            return Promise.resolve({
                is_deleted: true,
                wordId
            })

        } catch (err) {
            await this.queryRunner.rollbackTransaction()
            throw err
        } finally {
            await this.queryRunner.release()
        }
    }
}