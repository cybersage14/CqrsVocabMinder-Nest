import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { getBoxDetailCommand } from "../impl/get-box-detail.command";
import { InjectRepository } from "@nestjs/typeorm";
import { BoxEntity } from "@src/entities";
import { Repository } from "typeorm";
import { BOX_NOT_FOUND, CustomError } from "@src/common/errors";

@QueryHandler(getBoxDetailCommand)
export class getBoxDetailHandler implements IQueryHandler<getBoxDetailCommand> {
    constructor(
        @InjectRepository(BoxEntity) private readonly boxRepository: Repository<BoxEntity>
    ) { }
    async execute(query: getBoxDetailCommand): Promise<any> {
        const { boxId, userId } = query
        const queryBuilder = this.boxRepository.createQueryBuilder('box')
            .andWhere('box.id = :boxId', { boxId })
            .leftJoinAndSelect('box.wordsBoxes', 'wordsBoxes')  
            .leftJoin('box.user', 'user')
            .andWhere('user.id = :userId', { userId })

        const result = await queryBuilder.getOne();
        if(!result) {
            throw new CustomError(BOX_NOT_FOUND)
        }
        return result;
    }
}