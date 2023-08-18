import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateBoxCommand } from "../impl";
import { QueryRunner, DataSource } from "typeorm";
import { BoxEntity } from "@src/entities";
import { GetUser } from "@src/modules/shared/functions";
import { GetBox } from "@src/modules/shared/functions/box.handler";
import { BOX_ALREADY_EXISTS, CustomError } from "@src/common/errors";

@CommandHandler(CreateBoxCommand)
export class CreateBoxHandler implements ICommandHandler<CreateBoxCommand> {
    queryRunner: QueryRunner;
    constructor(private dataSource: DataSource) { }
    async execute(command: CreateBoxCommand): Promise<BoxEntity> {
        this.queryRunner = this.dataSource.createQueryRunner()

        const { createBoxRequestDto, userId } = command
        const { name } = createBoxRequestDto

        try {
            /* -------------------------------------------------------------------------- */
            /*                              start Transaction                             */
            /* -------------------------------------------------------------------------- */
            await this.queryRunner.connect();
            await this.queryRunner.startTransaction();
            const manager = this.queryRunner.manager;
            /* -------------------------------- get user -------------------------------- */
            const user = await GetUser(manager, { id: userId })
            /* --------------------------------- get box -------------------------------- */
            const getBox = await GetBox(manager, {
                name,
                user: {
                    id: userId
                }
            })
            if (getBox) {
                throw new CustomError(BOX_ALREADY_EXISTS)
            }
             /* ------------------------------- create box ------------------------------- */
            const box = await this.queryRunner.manager.save(BoxEntity, {
                name,
                user
            })

            await this.queryRunner.commitTransaction();
            return Promise.resolve(box)
        } catch (err) {
            await this.queryRunner.rollbackTransaction()
            throw err
        } finally {
            await this.queryRunner.release();
        }
    }
}