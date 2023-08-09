import { BoxEntity } from "@src/entities";
import { EntityManager, FindOptionsRelations, FindOptionsWhere } from "typeorm";

export const GetBox = async (
    manager: EntityManager,
    where: FindOptionsWhere<BoxEntity>,
    relations: FindOptionsRelations<BoxEntity> = {}
) => {
    const box = await manager.findOne(BoxEntity, {
        where,
        relations: {
            ...relations
        },
    })
    return box
}