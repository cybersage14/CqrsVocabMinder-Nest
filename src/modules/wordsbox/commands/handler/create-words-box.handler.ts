import { ICommandHandler } from "@nestjs/cqrs";
import { CreateWordsBoxCommand } from "../impl/create-words-box.command";
import { DataSource, QueryRunner } from "typeorm";
import { UserEntity, WordsBoxEntity } from "@src/entities";
import { CustomError, USER_NOT_FOUND } from "@src/common/errors";

export class CreateWordsBoxHandler implements ICommandHandler<CreateWordsBoxCommand> {
    queryRunner: QueryRunner;
    constructor(private dataSource: DataSource) { }
    async execute(command: CreateWordsBoxCommand): Promise<WordsBoxEntity> {
        const { userId, createWordsBoxRequestDto } = command;
        const { name } = createWordsBoxRequestDto;
        this.queryRunner = this.dataSource.createQueryRunner();

        try {
            await this.queryRunner.connect();
            await this.queryRunner.startTransaction();

            const user = await this.queryRunner.manager.findOne(UserEntity, {
                where: {
                    id: userId
                }
            });

            if (!user) {
                throw new CustomError(USER_NOT_FOUND)
            }

            const wordsBox = this.queryRunner.manager.create(WordsBoxEntity, {
                name,
            })
            const saveWordsBox = await this.queryRunner.manager.save(wordsBox)

            await this.queryRunner.commitTransaction();
            return Promise.resolve(saveWordsBox)
        } catch (err) {
            console.log(err);
            await this.queryRunner.rollbackTransaction()
            throw err
        } finally {
            await this.queryRunner.release();
        }
    }
}