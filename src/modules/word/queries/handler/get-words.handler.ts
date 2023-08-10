import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { WordEntity } from "../../../../entities";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { paginate } from "../../../../common/helper/paginate";
import { IPaginate } from "../../../../common/interfaces/paginate";
import { GetWordsQuery } from "../impl";

@QueryHandler(GetWordsQuery)
export class GetWordsHandler implements IQueryHandler<GetWordsQuery> {
    constructor(
        @InjectRepository(WordEntity) private readonly wordRepository: Repository<WordEntity>
    ) { }
    async execute(query: GetWordsQuery): Promise<WordEntity | IPaginate<WordEntity> | WordEntity [] > {
        const { getWordsRequestDto, userId } = query
        const { filters, getAll, limit, page, search, sort, sortType } = getWordsRequestDto

        const queryBuilder = this.wordRepository.createQueryBuilder('word')
            .leftJoinAndSelect('word.user', 'user')
            .andWhere('user.id = :userId', { userId })

        if (sort && sortType) {
            queryBuilder.orderBy(sort, sortType);
        }
        if (search) {
            queryBuilder.andWhere('(word.word ILIKE :search)', {
              search: `%${search}%`,
            });
          }

        if (getAll) {
            return await queryBuilder.getMany()
        }

        return paginate<WordEntity>(queryBuilder, limit, page);
    }

}