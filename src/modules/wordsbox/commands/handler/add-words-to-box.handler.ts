import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AddWordToBox } from "../impl";
import { QueryRunner, DataSource } from "typeorm";
import { WordEntity, WordsBoxEntity } from "@src/entities";
import { CustomError, WORDS_BOX_NOT_FOUND } from "@src/common/errors";
import { HttpStatus } from "@nestjs/common";
import { GetUser } from "@src/modules/shared/functions";
import { GetWordsBox } from "@src/modules/shared/functions/wordsBox.helper";

@CommandHandler(AddWordToBox)
export class AddWordToBoxHandler implements ICommandHandler<AddWordToBox> {
    queryRunner: QueryRunner;
    constructor(private dataSource: DataSource) { }
    async execute(command: AddWordToBox): Promise<WordsBoxEntity> {
        const { userId, addWordToBoxRequestDto, boxId } = command
        const { ids } = addWordToBoxRequestDto
        this.queryRunner = this.dataSource.createQueryRunner();
        try {
            /* -------------------------------------------------------------------------- */
            /*                              start transaction                             */
            /* -------------------------------------------------------------------------- */
            await this.queryRunner.connect();
            await this.queryRunner.startTransaction();
            const manager = this.queryRunner.manager;
            /* -------------------------------- find user ------------------------------- */
            await GetUser(manager, { id: userId })
            /* ------------------------------- get words ------------------------------- */
            const words = await this.getWords(ids)
            /* ------------------------------ get words box ----------------------------- */
            const wordBox = await GetWordsBox(manager, { id: boxId }, { words: true })
            if (!wordBox) {
                throw new CustomError(WORDS_BOX_NOT_FOUND)
            }
            /* ---------------------------- update words box ---------------------------- */
            const updateWordsBox = await this.updateWordsBox(wordBox, {
                words: words,
            })
            await this.queryRunner.commitTransaction();
            return Promise.resolve(updateWordsBox)
        } catch (err) {
            await this.queryRunner.rollbackTransaction()
            throw err
        } finally {
            await this.queryRunner.release();
        }
    }
    async updateWordsBox(wordsBox: Partial<WordsBoxEntity>, prop: Partial<WordsBoxEntity>) {
        Object.assign(wordsBox, { ...prop });
        return await this.queryRunner.manager.save(WordsBoxEntity, wordsBox);
    }

    async getWords(ids: string[]) {
        const words: WordEntity[] = []
        for (let i = 0; i < ids.length; i++) {
            const word = await this.queryRunner.manager.findOne(WordEntity, {
                where: {
                    id: ids[i]
                }
            })
            if (!word) {
                throw new CustomError({
                    description: "Word not found",
                    status: HttpStatus.NOT_FOUND,
                })
            }
            words.push(word)
        }
        return words
    }
}