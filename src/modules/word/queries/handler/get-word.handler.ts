import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { WordEntity } from "../../../../entities";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GetWordQuery } from "../impl";
import { CustomError, WORD_NOT_FOUND } from "@src/common/errors";

@QueryHandler(GetWordQuery)
export class GetWordHandler implements IQueryHandler<GetWordQuery> {
    constructor(
        @InjectRepository(WordEntity) private readonly wordRepository: Repository<WordEntity>
    ) { }
    async execute(query: GetWordQuery): Promise<WordEntity> {
        const { userId, wordId } = query

        const queryBuilder = this.wordRepository.createQueryBuilder('word')
            .andWhere('word.id = :wordId', { wordId })
            .leftJoin('word.user', 'user')
            .andWhere('user.id = :userId', { userId })
        if(await queryBuilder.getOne()===null){ 
            throw new CustomError(WORD_NOT_FOUND)
        }
        return await queryBuilder.getOne()
    }

}