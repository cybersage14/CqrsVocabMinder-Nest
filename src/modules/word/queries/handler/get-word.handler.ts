import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { WordEntity } from "../../../../entities";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GetWordQuery } from "../impl";

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

        return await queryBuilder.getOne()
    }

}