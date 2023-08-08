import { CustomError, USER_NOT_FOUND } from "@src/common/errors";
import { UserEntity } from "@src/entities";
import { EntityManager, FindOptionsRelations, FindOptionsWhere } from "typeorm";

export const GetUser = async (
    manager: EntityManager,
    where: FindOptionsWhere<UserEntity>,
    relations: FindOptionsRelations<UserEntity> = {}
) => {
    const user = await manager.findOne(UserEntity, {
        where,
        relations: {
            ...relations
        },
    })
    if (!user) {
        throw new CustomError(USER_NOT_FOUND)
    }
    return user
}