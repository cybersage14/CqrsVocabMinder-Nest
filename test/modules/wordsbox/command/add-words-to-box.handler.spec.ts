import { faker } from "@faker-js/faker";
import { INestApplication } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { AppModule } from "@src/app.module";
import { BOX_ALREADY_EXISTS, WORDS_BOX_NOT_FOUND, WORD_NOT_FOUND } from "@src/common/errors";
import { ROUTES } from "@src/common/routes/routes";
import { URL_REPLACE_PARAMS } from "@src/common/utils";
import { UserEntity, WordsBoxEntity, } from "@src/entities";
import { AddWordToBoxRequestDto, CreateWordsBoxRequestDto } from "@src/modules/wordsbox/dto";
import { createUser, createWord } from "@test/helper";
import { createWordsBox } from "@test/helper/createWordsBox.helper";
import { response } from "express";
import { options } from "ormconfig";
import * as request from 'supertest';
import { EntityManager, DataSource } from "typeorm";

const URL = ROUTES.WORDS_BOX.ROOT + ROUTES.WORDS_BOX.UPDATE_ADD_WORDS_TO_BOX.URL

let dataSource: DataSource;
describe(ROUTES.WORDS_BOX.UPDATE_ADD_WORDS_TO_BOX.DESCRIPTION, () => {
    let app: INestApplication;
    let manager: EntityManager;

    let addWordToBoxRequestDto: AddWordToBoxRequestDto

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = module.createNestApplication();
        await app.init();
        dataSource = new DataSource(options);
        await dataSource.initialize();
        manager = dataSource.manager;
    });

    beforeEach(async () => {
        await dataSource.dropDatabase();
        await dataSource.synchronize();
    });

    afterAll(async () => {
        await dataSource.destroy();
        await app.close();
    });

    it("should create words box", async () => {
        const { token, user } = await createUser(manager)

        const wordsBox = await createWordsBox(manager, { user })
        let wordsId = []
        for (let i = 0; i < 10; i++) {
            const words = await createWord(manager, { user })
            wordsId.push(words.id)
        }
        addWordToBoxRequestDto = {
            ids: wordsId
        }
        const response = await request(app.getHttpServer())
            .put(URL_REPLACE_PARAMS(URL, { [ROUTES.WORDS_BOX.UPDATE_ADD_WORDS_TO_BOX.PARAM]: wordsBox.id }))
            .auth(token, { type: 'bearer' })
            .send(addWordToBoxRequestDto)

        const getUser = await manager.findOne(UserEntity, {
            where: { id: user.id },
            relations: {
                wordsBoxes: true
            }
        })

        expect(response.body.id).toEqual(getUser.wordsBoxes[0].id);
        expect(wordsBox.id).toEqual(response.body.id)
        response.body.words.forEach((word, index) => {
            expect(word.id).toEqual(wordsId[index]);
        });
    })
    it("should throw an error WORD_NOT_FOUND", async () => {
        const { token, user } = await createUser(manager)

        const response = await request(app.getHttpServer())
            .put(URL_REPLACE_PARAMS(URL, { [ROUTES.WORDS_BOX.UPDATE_ADD_WORDS_TO_BOX.PARAM]: faker.string.uuid() }))
            .auth(token, { type: 'bearer' })
            .send(addWordToBoxRequestDto)

        expect(response.status).toEqual(404)
        expect(response.body.message).toEqual(WORD_NOT_FOUND.description)
        expect(response.body.statusCode).toEqual(WORD_NOT_FOUND.status)
    })
    it("should throw an error WORDS_BOX_NOT_FOUND", async () => {
        const { token, user } = await createUser(manager)

        const words = await createWord(manager, { user })

        addWordToBoxRequestDto = {
            ids: [words.id]
        }
        
        const response = await request(app.getHttpServer())
            .put(URL_REPLACE_PARAMS(URL, { [ROUTES.WORDS_BOX.UPDATE_ADD_WORDS_TO_BOX.PARAM]: faker.string.uuid() }))
            .auth(token, { type: 'bearer' })
            .send(addWordToBoxRequestDto)

        expect(response.status).toEqual(404)
        expect(response.body.message).toEqual(WORDS_BOX_NOT_FOUND.description)
        expect(response.body.statusCode).toEqual(WORDS_BOX_NOT_FOUND.status)
    })
});