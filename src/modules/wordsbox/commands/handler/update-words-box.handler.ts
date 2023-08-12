import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateWordsBoxCommand } from "../impl";
import { DataSource, QueryRunner } from "typeorm";
import { GetWordsBox } from "@src/modules/shared/functions/wordsBox.helper";
import { CustomError, WORDS_BOX_NOT_FOUND } from "@src/common/errors";
import { WordsBoxEntity } from "@src/entities";

@CommandHandler(UpdateWordsBoxCommand)
export class UpdateWordsBoxHandler implements ICommandHandler<UpdateWordsBoxCommand> {
    queryRunner: QueryRunner
    constructor(private dataSource: DataSource) { }
    async execute(command: UpdateWordsBoxCommand): Promise<WordsBoxEntity> {
        const { boxId, userId, updateWordsBoxRequestDto } = command
        const { is_learned, name } = updateWordsBoxRequestDto
        this.queryRunner = this.dataSource.createQueryRunner()
        try {
            /* -------------------------------------------------------------------------- */
            /*                              start transaction                             */
            /* -------------------------------------------------------------------------- */
            await this.queryRunner.connect()
            await this.queryRunner.startTransaction()
            /* ------------------------------ get words box ----------------------------- */
            const wordsBox = await GetWordsBox(this.queryRunner.manager, {
                id: boxId,
                user: { id: userId }
            })
            if (!wordsBox) {
                throw new CustomError(WORDS_BOX_NOT_FOUND)
            }
            /* ------------------------------ update words box -------------------------- */
            if (is_learned) {
                wordsBox.markWordAsLearned()
            }
            const updateWordsBox = await this.updateWordsBox(wordsBox, {
                name: name ? name : wordsBox.name,
                is_learned
            })
            await this.queryRunner.commitTransaction()
            return Promise.resolve(updateWordsBox)
        } catch (err) {
            await this.queryRunner.rollbackTransaction()
            throw err
        } finally {
            this.queryRunner.release()
        }
    }
    async updateWordsBox(wordsBox: Partial<WordsBoxEntity>, prop: Partial<WordsBoxEntity>) {
        Object.assign(wordsBox, { ...prop })
        return await this.queryRunner.manager.save(WordsBoxEntity, wordsBox)
    }
}