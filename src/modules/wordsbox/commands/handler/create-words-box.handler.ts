import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DataSource, QueryRunner } from "typeorm";
import { UserEntity, WordsBoxEntity } from "@src/entities";
import { CustomError, USER_NOT_FOUND } from "@src/common/errors";
import { CreateWordsBoxCommand } from "../impl";
import { HttpStatus } from "@nestjs/common";

@CommandHandler(CreateWordsBoxCommand)
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
            

            const wordsBox = await this.queryRunner.manager.findOne(WordsBoxEntity, {
                where: {
                    name
                }
            })
            console.log(wordsBox);
            
            if(wordsBox) {
                throw new CustomError({
                    description: "Word already exists",
                    status: HttpStatus.BAD_REQUEST,
                })
            }

            const saveWordsBox = this.queryRunner.manager.create(WordsBoxEntity, {
                name
            })
            await this.queryRunner.manager.save(WordsBoxEntity, saveWordsBox)

            await this.queryRunner.commitTransaction();
            return Promise.resolve(saveWordsBox)
        } catch (err) {
            await this.queryRunner.rollbackTransaction()
            throw err
        } finally {
            await this.queryRunner.release();
        }
    }
}