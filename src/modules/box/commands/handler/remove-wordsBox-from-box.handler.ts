import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RemoveWordsBoxFromBoxCommand } from "../impl";
import { CustomError, BOX_NOT_FOUND, WORDS_BOX_NOT_IN_YOUR_BOX } from "@src/common/errors";
import { GetUser } from "@src/modules/shared/functions";
import { GetBox } from "@src/modules/shared/functions/box.handler";
import { QueryRunner, DataSource } from "typeorm";
import { BoxEntity, WordsBoxEntity } from "@src/entities";
import { GetWordsBox } from "@src/modules/shared/functions/wordsBox.helper";

@CommandHandler(RemoveWordsBoxFromBoxCommand)
export class RemoveWordsBoxFromBoxHandler implements ICommandHandler<RemoveWordsBoxFromBoxCommand> {
    queryRunner: QueryRunner;
    constructor(private dataSource: DataSource) { }
    async execute(command: RemoveWordsBoxFromBoxCommand): Promise<any> {
        const { boxId, userId, removeWordsBoxFromBoxRequestDto } = command
        const { wordsBoxIds } = removeWordsBoxFromBoxRequestDto
        this.queryRunner = this.dataSource.createQueryRunner()
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
                id: boxId,
                user: {
                    id: user.id
                },

            }, {
                wordsBoxes: true
            }
            )
            if (!getBox) {
                throw new CustomError(BOX_NOT_FOUND)
            }
            await this.getWordsBox(wordsBoxIds, user.id)
            /* --------------------  Filter out the words box to remove ------------------- */
            const wordsToRemove = getBox.wordsBoxes.filter(wordsBox => wordsBoxIds.includes(wordsBox.id));
            if (wordsToRemove.length === 0) {
                throw new CustomError(WORDS_BOX_NOT_IN_YOUR_BOX)
            }
            
            /* ---------------------------- remove words box ---------------------------- */
            const removeWordsBox = await this.removeWordsBox(getBox, wordsToRemove)

            await this.queryRunner.commitTransaction()
            return Promise.resolve(removeWordsBox)
        } catch (err) {
            await this.queryRunner.rollbackTransaction()
            throw err
        } finally {
            await this.queryRunner.release();
        }
    }
    async removeWordsBox(box: Partial<BoxEntity>, wordsToRemove: WordsBoxEntity[]) {
        box.wordsBoxes = box.wordsBoxes.filter(word => !wordsToRemove.includes(word));
        return await this.queryRunner.manager.save(BoxEntity, box);

    }
    async getWordsBox(ids: string[], userId: string) {
        const wordsBoxes: WordsBoxEntity[] = []
        for (let i = 0; i < ids.length; i++) {
            const getWordsBox = await GetWordsBox(this.queryRunner.manager, {
                id: ids[i], user: {
                    id: userId
                }
            })
            if (!getWordsBox) {
                throw new CustomError(BOX_NOT_FOUND)
            }
            wordsBoxes.push(getWordsBox)
        }
        return wordsBoxes
    }
}