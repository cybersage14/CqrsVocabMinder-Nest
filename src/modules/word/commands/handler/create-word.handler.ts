import {  CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateWordCommand } from "../impl";
import { DataSource, QueryRunner } from "typeorm";
import { CustomError, USER_NOT_FOUND } from "common/errors";
import { UserEntity, WordEntity } from "./../../../../entities";

@CommandHandler(CreateWordCommand) 

export class CreateWordHandler implements ICommandHandler<CreateWordCommand> {
    queryRunner: QueryRunner;
    constructor(private dataSource: DataSource) {}
    async execute(command: CreateWordCommand):Promise<WordEntity> {
        const { userId, createWordRequestDto } = command;
        const {definition, usage, pronounce,word} = createWordRequestDto;

        this.queryRunner = this.dataSource.createQueryRunner();
        try {
            /* -------------------------------------------------------------------------- */
            /*                              start Transaction                             */
            /* -------------------------------------------------------------------------- */
            await this.queryRunner.connect();
            await this.queryRunner.startTransaction();
            
            /* -------------------------------------------------------------------------- */
            /*                                  get user                                  */
            /* -------------------------------------------------------------------------- */
            const user = await this.queryRunner.manager.findOne(UserEntity, {
                where:{
                    id: userId
                }
            })
            // if(!user){
            //     throw new CustomError(USER_NOT_FOUND)
            // }
            /* -------------------------------------------------------------------------- */
            /*                                 create word                                */
            /* -------------------------------------------------------------------------- */
            const createWord = this.queryRunner.manager.create(WordEntity,{
                definition,
                usage,
                pronounce,
                word,
                user
            })
           return  await this.queryRunner.manager.save(createWord);
        } catch (err) {
            console.log(err);
            
            await this.queryRunner.rollbackTransaction()
            throw err
        }finally{
            await this.queryRunner.release();
        }
    }
}