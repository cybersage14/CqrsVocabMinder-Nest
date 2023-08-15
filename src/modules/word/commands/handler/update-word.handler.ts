import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { QueryRunner, DataSource } from "typeorm";
import { GetWord } from "@src/modules/shared/functions/word.helper";
import { UpdateWordCommand } from "../impl";
import { WordEntity } from "@src/entities";
import { GetUser } from "@src/modules/shared/functions";
import { CustomError, WORD_NOT_FOUND } from "@src/common/errors";

@CommandHandler(UpdateWordCommand)
export class UpdateWord implements ICommandHandler<UpdateWordCommand> {
    queryRunner: QueryRunner;
    constructor(private dataSource: DataSource) { }
    async execute(command: UpdateWordCommand): Promise<WordEntity> {
        const { updateWordRequestDto, wordId, userId } = command
        const { definition, usage, pronounce, example, word } = updateWordRequestDto
        this.queryRunner = this.dataSource.createQueryRunner();
        try {
            /* -------------------------------------------------------------------------- */
            /*                              start Transaction                             */
            /* -------------------------------------------------------------------------- */
            await this.queryRunner.connect();
            await this.queryRunner.startTransaction();
            const manager = this.queryRunner.manager;
            const user = await GetUser(manager, { id: userId })
            /* -------------------------------- get word -------------------------------- */
            const getWord = await GetWord(manager, {
                id: wordId, 
                user: {
                    id: user.id
                }
            })
            if(!getWord) {
                throw new CustomError(WORD_NOT_FOUND)
            }
            /* ------------------------------- update word ------------------------------ */
            const updateWord = await this.updateWord(getWord, { definition, usage, pronounce, example, word })

            await this.queryRunner.commitTransaction();
            return Promise.resolve(updateWord);
        } catch (err) {
            await this.queryRunner.rollbackTransaction()
            throw err
        } finally {
            await this.queryRunner.release();
        }
    }
    async updateWord(word: Partial<WordEntity>, prop: Partial<WordEntity>) {
        Object.assign(word, { ...prop })
        return await this.queryRunner.manager.save(WordEntity, word)
    }

}