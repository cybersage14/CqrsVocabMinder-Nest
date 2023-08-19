import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetBoxesCommand } from "../impl";
import { InjectRepository } from "@nestjs/typeorm";
import { BoxEntity } from "@src/entities";
import { Repository } from "typeorm";
import { paginate } from "@src/common/helper/paginate";

@QueryHandler(GetBoxesCommand)
export class GetBoxesHandler implements IQueryHandler<GetBoxesCommand>{
    constructor(
        @InjectRepository(BoxEntity) private readonly boxRepository: Repository<BoxEntity>
    ) { }
    async execute(query: GetBoxesCommand): Promise<any> {
        const { getBoxesRequestDto, userId } = query
        const { getAll, limit, page, search, sort, sortType } = getBoxesRequestDto

        const queryBuilder = this.boxRepository.createQueryBuilder('box')
            .leftJoinAndSelect('box.user', 'user')
            .andWhere('user.id = :userId', { userId })

        if (sort && sortType) {
            queryBuilder.orderBy(sort, sortType);
        }
        if (search) {
            queryBuilder.andWhere('(box.name ILIKE :search)', {
                search: `%${search}%`,
            });
        }

        if (getAll) {
            return await queryBuilder.getMany()
        }

        return await paginate<BoxEntity>(queryBuilder, limit, page);
    }

}