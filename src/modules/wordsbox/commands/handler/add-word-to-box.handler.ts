import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AddWordToBox } from "../impl";
import { QueryRunner, DataSource } from "typeorm";
import { UserEntity, WordEntity, WordsBoxEntity } from "@src/entities";
import { CustomError, USER_NOT_FOUND } from "@src/common/errors";
import { HttpStatus } from "@nestjs/common";

@CommandHandler(AddWordToBox)
export class AddWordToBoxHandler implements ICommandHandler<AddWordToBox> {
    queryRunner: QueryRunner;
    constructor(private dataSource: DataSource) { }
    async execute(command: AddWordToBox): Promise<WordsBoxEntity> {
        const { userId, addWordToBoxRequestDto, boxId } = command
        const { id } = addWordToBoxRequestDto
        this.queryRunner = this.dataSource.createQueryRunner();
        try {
            await this.queryRunner.connect();
            await this.queryRunner.startTransaction();

            const user = await this.queryRunner.manager.findOne(UserEntity, {
                where: {
                    id: userId
                }
            })
            if (!user) {
                throw new CustomError(USER_NOT_FOUND)
            }
            const word = await this.queryRunner.manager.findOne(WordEntity, {
                where: {
                    id
                }
            })
            if (!word) {
                throw new CustomError({
                    description: "Word not found",
                    status: HttpStatus.NOT_FOUND,
                })
            }
            console.log(word);
            
            const wordBox = await this.queryRunner.manager.findOne(WordsBoxEntity, {
                where: {
                    id: boxId,
                },
                relations:{
                    words: true
                }
            })
            if (!wordBox) {
                throw new CustomError({
                    description: "Box not found",
                    status: HttpStatus.NOT_FOUND,
                })
            }
            console.log("worddss box",wordBox);
            
            const updateWordsBox = await this.updateWordsBox(wordBox, {
                words: [...wordBox.words, word],
            })

            console.log(updateWordsBox);

            await this.queryRunner.commitTransaction();
            return  Promise.resolve(updateWordsBox)
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
}