import { faker } from "@faker-js/faker";
import { INestApplication } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { AppModule } from "@src/app.module";
import { WORD_NOT_FOUND } from "@src/common/errors";
import { ROUTES } from "@src/common/routes/routes";
import { URL_REPLACE_PARAMS } from "@src/common/utils";
import { WordEntity } from "@src/entities";
import { createWord } from "@test/helper";
import { createUser } from "@test/helper/createUser.helper";
import { options } from "ormconfig";
import * as request from 'supertest';
import { EntityManager, DataSource } from "typeorm";

const URL = ROUTES.WORD.ROOT + ROUTES.WORD.DELETE_WORD_BY_ID.URL

let dataSource: DataSource;
describe(ROUTES.WORD.DELETE_WORD_BY_ID.DESCRIPTION, () => {
    let app: INestApplication;
    let manager: EntityManager;

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
    it("should delete word", async () => {
        const { token, user } = await createUser(manager);
        const word = await createWord(manager, { user })

        const response = await request(app.getHttpServer())
            .delete(URL_REPLACE_PARAMS(URL,{[ROUTES.WORD.DELETE_WORD_BY_ID.PARAM]:word.id}))
            .auth(token, { type: 'bearer' })

        const getWord = await manager.findOne(WordEntity, { where: { id: word.id } })

        expect(response.body.wordId).toEqual(word.id)
        expect(word.id).toEqual(response.body.wordId);
        expect(response.body.is_deleted).toEqual(true);
        expect(getWord).toBeNull()
    })

    it("should throw error WORD_NOT_FOUND", async () => {
        const { token } = await createUser(manager);
        const response = await request(app.getHttpServer())
            .delete(URL_REPLACE_PARAMS(URL,{[ROUTES.WORD.DELETE_WORD_BY_ID.PARAM]:faker.string.uuid()}))
            .auth(token, { type: 'bearer' })

        expect(response.status).toEqual(404)
        expect(response.body.message).toEqual(WORD_NOT_FOUND.description)
        expect(response.body.statusCode).toEqual(WORD_NOT_FOUND.status)
    })
});