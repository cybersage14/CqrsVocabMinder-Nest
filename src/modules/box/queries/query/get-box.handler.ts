import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { getBoxCommand } from "../impl/get-box.command";
import { InjectRepository } from "@nestjs/typeorm";
import { BoxEntity } from "@src/entities";
import { Repository } from "typeorm";
import { paginate } from "@src/common/helper/paginate";

@QueryHandler(getBoxCommand)
export class getBoxHandler implements IQueryHandler<getBoxCommand> {
    constructor(
        @InjectRepository(BoxEntity) private readonly boxRepository: Repository<BoxEntity>
    ) { }
    async execute(query: getBoxCommand): Promise<any> {
        const { boxId, userId } = query
        const queryBuilder = this.boxRepository.createQueryBuilder('box')
            .andWhere('box.id = :boxId', { boxId })
            .leftJoinAndSelect('box.wordsBoxes', 'wordsBoxes')
            .leftJoinAndSelect('box.user', 'user')
            .andWhere('user.id = :userId', { userId })

        const result = await queryBuilder.getOne();
        return result;
    }
}