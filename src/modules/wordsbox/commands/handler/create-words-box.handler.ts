import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DataSource, QueryRunner } from "typeorm";
import { WordsBoxEntity } from "@src/entities";
import { CustomError, BOX_ALREADY_EXISTS } from "@src/common/errors";
import { CreateWordsBoxCommand } from "../impl";
import { GetUser } from "@src/modules/shared/functions";
import { GetWordsBox } from "@src/modules/shared/functions/wordsBox.helper";

@CommandHandler(CreateWordsBoxCommand)
export class CreateWordsBoxHandler implements ICommandHandler<CreateWordsBoxCommand> {
    queryRunner: QueryRunner;
    constructor(private dataSource: DataSource) { }
    async execute(command: CreateWordsBoxCommand): Promise<WordsBoxEntity> {
        const { userId, createWordsBoxRequestDto } = command;
        const { name } = createWordsBoxRequestDto;
        this.queryRunner = this.dataSource.createQueryRunner();

        try {
            /* -------------------------------------------------------------------------- */
            /*                              start transaction                             */
            /* -------------------------------------------------------------------------- */
            await this.queryRunner.connect();
            await this.queryRunner.startTransaction();
            const manager = this.queryRunner.manager;
            /* -------------------------------- get user -------------------------------- */
            const user = await GetUser(manager, { id: userId })
            /* ------------------------------ get words box ----------------------------- */
            const wordsBox = await GetWordsBox(manager, {
                name, user:{
                    id:user.id
                }
            })
            if (wordsBox) {
                throw new CustomError(BOX_ALREADY_EXISTS)
            }
            /* ---------------------------- create words box ---------------------------- */
            const createWordsBox = await this.createWordsBox({
                name,
                user
            })
            
            await this.queryRunner.commitTransaction();

            return Promise.resolve(createWordsBox)
        } catch (err) {
            await this.queryRunner.rollbackTransaction()
            throw err
        } finally {
            await this.queryRunner.release();
        }
    }
    async createWordsBox(wordsBox: Partial<WordsBoxEntity>) {
        return await this.queryRunner.manager.save(WordsBoxEntity, wordsBox);
    }
}