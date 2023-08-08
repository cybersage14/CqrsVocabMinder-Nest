import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateWordCommand } from "../impl";
import { DataSource, QueryRunner } from "typeorm";
import { WordEntity } from "@src/entities";
import { GetUser } from "@src/modules/shared/functions";

@CommandHandler(CreateWordCommand)
export class CreateWordHandler implements ICommandHandler<CreateWordCommand> {
    queryRunner: QueryRunner;
    constructor(private dataSource: DataSource) { }
    async execute(command: CreateWordCommand): Promise<WordEntity> {

        const { userId, createWordRequestDto } = command;
        const { definition, usage, pronounce, word, example } = createWordRequestDto;

        this.queryRunner = this.dataSource.createQueryRunner();
        try {
            /* -------------------------------------------------------------------------- */
            /*                              start Transaction                             */
            /* -------------------------------------------------------------------------- */
            await this.queryRunner.connect();
            await this.queryRunner.startTransaction();
            const manager = this.queryRunner.manager;
            /* -------------------------------------------------------------------------- */
            /*                                  get user                                  */
            /* -------------------------------------------------------------------------- */
            const user = await GetUser(manager,{ id: userId })
            /* -------------------------------------------------------------------------- */
            /*                                 create word                                */
            /* -------------------------------------------------------------------------- */
            const createWord = await this.queryRunner.manager.save(WordEntity, {
                definition,
                usage,
                pronounce,
                example,
                word,
                user
            })
            await this.queryRunner.commitTransaction();
            return Promise.resolve(createWord);
        } catch (err) {
            console.log(err);
            await this.queryRunner.rollbackTransaction()
            throw err
        } finally {
            await this.queryRunner.release();
        }
    }
}