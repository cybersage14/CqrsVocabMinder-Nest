import { faker } from "@faker-js/faker";
import { WordEntity, WordsBoxEntity } from "@src/entities";
import { EntityManager } from "typeorm";

export const createWordsBox = async (manager: EntityManager, {
    is_learned,
    last_reviewed_date,
    words,
    Box,
    name,
    user,
}: Partial<WordsBoxEntity>) => {
    const wordEntity = manager.create(WordsBoxEntity, {
        is_learned: is_learned ? is_learned : faker.datatype.boolean(),
        last_reviewed_date,
        words,
        Box,
        name: name ? name : faker.lorem.word(),
        user,
    })
    return await manager.save(WordEntity, wordEntity)
};
