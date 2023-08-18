import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RemoveWordsCommand } from "../impl";
import { DataSource, QueryRunner } from "typeorm";
import { GetUser } from "@src/modules/shared/functions";
import { WordEntity, WordsBoxEntity } from "@src/entities";
import { CustomError, WORDS_BOX_NOT_FOUND, WORD_NOT_FOUND, WORD_NOT_YOUR_BOX } from "@src/common/errors";
import { GetWord } from "@src/modules/shared/functions/word.helper";
import { GetWordsBox } from "@src/modules/shared/functions/wordsBox.helper";

@CommandHandler(RemoveWordsCommand)
export class RemoveWordsHandler implements ICommandHandler<RemoveWordsCommand> {
    queryRunner: QueryRunner;
    constructor(
        private dataSource: DataSource
    ) { }
    async execute(command: RemoveWordsCommand): Promise<WordsBoxEntity> {
        const { userId, boxId, removeWordsRequestDto } = command
        const { wordsIds } = removeWordsRequestDto
        this.queryRunner = this.dataSource.createQueryRunner();
        try {
            await this.queryRunner.connect()
            await this.queryRunner.startTransaction()
            const manager = this.queryRunner.manager

            /* -------------------------------- find user ------------------------------- */
            const user = await GetUser(manager, { id: userId })
            /* ------------------------------- get words ------------------------------- */
            await this.getWords(wordsIds, user.id)
            /* ------------------------------ get words box ----------------------------- */
            const wordsBox = await GetWordsBox(manager, { id: boxId }, { words: true })
            if (!wordsBox) {
                throw new CustomError(WORDS_BOX_NOT_FOUND)
            }
            /* --------------------  Filter out the words to remove ------------------- */
            const wordsToRemove = wordsBox.words.filter(word => wordsIds.includes(word.id));
            if(wordsToRemove.length === 0){
                throw new CustomError(WORD_NOT_YOUR_BOX)
            }
            /* ---------------------------- update words box ---------------------------- */
            const removeWords = await this.removeWords(wordsBox, wordsToRemove);
            
            await this.queryRunner.commitTransaction()
            return Promise.resolve(removeWords)
        } catch (err) {
            await this.queryRunner.rollbackTransaction()
            throw err
        } finally {
            await this.queryRunner.release()
        }
    }
    async removeWords(wordsBox: WordsBoxEntity, wordsToRemove: WordEntity[]) {
        wordsBox.words = wordsBox.words.filter(word => !wordsToRemove.includes(word));
        return await this.queryRunner.manager.save(WordsBoxEntity, wordsBox);
    }


    async getWords(ids: string[], userId: string) {
        const words: WordEntity[] = []
        for (let i = 0; i < ids.length; i++) {
            const word = await GetWord(this.queryRunner.manager, {
                id: ids[i], user: {
                    id: userId
                }
            })
            if (!word) {
                throw new CustomError(WORD_NOT_FOUND)
            }
            words.push(word)
        }
        return words
    }
}