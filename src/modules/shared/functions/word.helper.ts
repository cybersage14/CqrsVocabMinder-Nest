import { WordEntity } from "@src/entities";
import { EntityManager, FindOptionsRelations, FindOptionsWhere } from "typeorm";

export const GetWord = async (
    manager: EntityManager,
    where: FindOptionsWhere<WordEntity>,
    relations: FindOptionsRelations<WordEntity> = {}
) => {
    const word = await manager.findOne(WordEntity, {
        where,
        relations: {
            ...relations
        },
    })
    return word
}