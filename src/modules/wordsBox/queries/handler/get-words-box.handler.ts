import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetWordsBoxQuery } from "../impl";
import { InjectRepository } from "@nestjs/typeorm";
import { WordsBoxEntity } from "@src/entities";
import { Repository } from "typeorm";
import { paginate } from "@src/common/helper/paginate";
import { IPaginate } from "@src/common/interfaces/paginate";

@QueryHandler(GetWordsBoxQuery)
export class GetWordsBoxHandler implements IQueryHandler<GetWordsBoxQuery> {
    constructor(
        @InjectRepository(WordsBoxEntity)
        private readonly wordsBoxRepository: Repository<WordsBoxEntity>
    ) { }
    async execute(query: GetWordsBoxQuery): Promise<IPaginate<WordsBoxEntity> | WordsBoxEntity[]> {
        const { getWordsRequestDto, userId } = query
        const { getAll, sortType, sort, page, limit, search, } = getWordsRequestDto

        const queryBuilder = this.wordsBoxRepository.createQueryBuilder('wordsBox')
            .leftJoin('wordsBox.user', 'user').andWhere('user.id = :userId', { userId })

        if (sort && sortType) {
            queryBuilder.orderBy(sort, sortType);
        }
        if (search) {
            queryBuilder.andWhere('(wordsBox.name ILIKE :search)', {
                search: `%${search}%`,
            });
        }

        if (getAll) {
            return await queryBuilder.getMany()
        }

        return paginate<WordsBoxEntity>(queryBuilder, limit, page);
    }

}
