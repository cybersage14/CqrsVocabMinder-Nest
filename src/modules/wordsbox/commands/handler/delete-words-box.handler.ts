import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteWordsBoxCommand } from "../impl";
import { DataSource, QueryRunner } from "typeorm";
import { GetWordsBox } from "@src/modules/shared/functions/wordsBox.helper";
import { GetUser } from "@src/modules/shared/functions";
import { CustomError, WORDS_BOX_NOT_FOUND } from "@src/common/errors";

@CommandHandler(DeleteWordsBoxCommand)
export class WordsBoxHandler implements ICommandHandler<DeleteWordsBoxCommand> {
    queryRunner: QueryRunner;
   constructor(private dataSource:DataSource){}
    async execute(command: DeleteWordsBoxCommand): Promise<any> {
        this.queryRunner = this.dataSource.createQueryRunner();
        const {userId,boxId: wordsBoxId} = command
        try {
            /* -------------------------------------------------------------------------- */
            /*                              start transaction                             */
            /* -------------------------------------------------------------------------- */
            await this.queryRunner.connect()
            await this.queryRunner.startTransaction()
            /* -------------------------------- get user -------------------------------- */
            const user= await GetUser(this.queryRunner.manager,{id:userId})
            /* ------------------------------ get words box ----------------------------- */
            const wordsBox = await GetWordsBox(this.queryRunner.manager,{id:wordsBoxId,user:{
                id:user.id
            }})
            if(!wordsBox){
                throw new CustomError(WORDS_BOX_NOT_FOUND)
            }
            /* ----------------------------- delete wordsBox ---------------------------- */
            await this.queryRunner.manager.remove(wordsBox)
            
            await this.queryRunner.commitTransaction()
            return {
                is_deleted:true,
                id:wordsBoxId
            }            
        } catch (err) {
            await this.queryRunner.rollbackTransaction()
            throw err
        }finally{
            await this.queryRunner.release()
        }
    }
}