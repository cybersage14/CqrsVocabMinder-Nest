import { faker } from "@faker-js/faker";
import {  BoxEntity, } from "@src/entities";
import { EntityManager } from "typeorm";

export const createBox = async (manager: EntityManager, {
    name,
    user,
    wordsBoxes
}: Partial<BoxEntity>) => {
    const boxEntity = manager.create(BoxEntity, {
        name: name ? name : faker.lorem.word(),
        user,
        wordsBoxes
    })
    return await manager.save(BoxEntity, boxEntity)
};
