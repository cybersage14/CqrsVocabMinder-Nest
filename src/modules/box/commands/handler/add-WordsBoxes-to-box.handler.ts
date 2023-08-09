import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AddWordsBoxesToBoxCommand } from "../impl/add-wordsBoxes-to-box.command";
import { QueryRunner, DataSource } from "typeorm";
import { BoxEntity, WordsBoxEntity } from "@src/entities";
import { GetBox } from "@src/modules/shared/functions/box.handler";
import { BOX_NOT_FOUND, CustomError } from "@src/common/errors";
import { GetWordsBox } from "@src/modules/shared/functions/wordsBox.helper";

@CommandHandler(AddWordsBoxesToBoxCommand)
export class AddWordsBoxesToBoxHandler implements ICommandHandler<AddWordsBoxesToBoxCommand> {
    queryRunner: QueryRunner;
    constructor(private dataSource: DataSource) { }
    async execute(command: AddWordsBoxesToBoxCommand): Promise<BoxEntity> {
        this.queryRunner = this.dataSource.createQueryRunner()

        const { createBoxRequestDto, boxId } = command
        const { WordBoxIds } = createBoxRequestDto
        try {
            /* -------------------------------------------------------------------------- */
            /*                              start Transaction                             */
            /* -------------------------------------------------------------------------- */
            await this.queryRunner.connect();
            await this.queryRunner.startTransaction();

            const getBox = await GetBox(this.queryRunner.manager, { id: boxId })
            
            if (!getBox) {
                throw new CustomError(BOX_NOT_FOUND)
            }
            const wordsBoxes = await this.getWordsBoxes(WordBoxIds)
            const saveBox = await this.updateBox(getBox, { wordsBoxes })

            await this.queryRunner.commitTransaction();
            return Promise.resolve(saveBox)
        } catch (err) {
            await this.queryRunner.rollbackTransaction()
            throw err
        } finally {
            await this.queryRunner.release();
        }
    }
    async getWordsBoxes(WordBoxIds: string[]) {
        const wordsBoxes: WordsBoxEntity[] = []
        for (let i = 0; i < WordBoxIds.length; i++) {
            const getWordsBox = await GetWordsBox(this.queryRunner.manager, { id: WordBoxIds[i] })
            wordsBoxes.push(getWordsBox)
        }
        return wordsBoxes
    }

    async updateBox(
        box: Partial<BoxEntity>, prop: Partial<BoxEntity>
    ) {
        Object.assign(box, { ...prop })
        return await this.queryRunner.manager.save(BoxEntity, box)
    }
}