import { faker } from "@faker-js/faker";
import { WordEntity } from "@src/entities";
import { EntityManager } from "typeorm";

export const createWord = async (manager: EntityManager, {
    definition,
    example,
    pronounce,
    usage,
    word,
    user
}: Partial<WordEntity>) => {
    const wordEntity = manager.create(WordEntity, {
        word: word ? word : faker.lorem.word(),
        definition: definition ? definition : faker.lorem.word(),
        example: example ? example : faker.lorem.word(),
        pronounce: pronounce ? pronounce : faker.lorem.word(),
        usage: usage ? usage : faker.lorem.word(),
        user
    })
    return await manager.save(WordEntity,wordEntity)
}