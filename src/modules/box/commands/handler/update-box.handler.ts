import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateBoxCommand } from "../impl";
import { DataSource, QueryRunner } from "typeorm";
import { GetUser } from "@src/modules/shared/functions";
import { GetBox } from "@src/modules/shared/functions/box.handler";
import { BOX_NOT_FOUND, CustomError } from "@src/common/errors";
import { BoxEntity } from "@src/entities";

@CommandHandler(UpdateBoxCommand)
export class UpdateBoxHandler implements ICommandHandler<UpdateBoxCommand> {
    queryRunner: QueryRunner
    constructor(
        private dataSource: DataSource
    ) { }
    async execute(command: UpdateBoxCommand): Promise<BoxEntity> {
        const { userId, boxId, updateBoxRequestDto } = command
        const { name } = updateBoxRequestDto
        this.queryRunner = this.dataSource.createQueryRunner()
        try {
            await this.queryRunner.connect()
            await this.queryRunner.startTransaction()
            const manager = this.queryRunner.manager

            const user = await GetUser(manager, { id: userId })
            const box = await GetBox(manager, {
                id: boxId,
                user: {
                    id: user.id
                },
            })
            if (!box) {
                throw new CustomError(BOX_NOT_FOUND)
            }
            const updateBox = await this.updateBox(box, { name })
            
            await this.queryRunner.commitTransaction()
            
            return Promise.resolve(updateBox)
        } catch (err) {
            await this.queryRunner.rollbackTransaction()
            throw err
        } finally {
           await this.queryRunner.release()
        }
    }
   async updateBox(box:Partial<BoxEntity>,prop:Partial<BoxEntity>) {
      Object.assign(box,{...prop})
      return await this.queryRunner.manager.save(BoxEntity,box)
    }
}