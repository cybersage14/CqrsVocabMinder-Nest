import { faker } from "@faker-js/faker";
import { INestApplication } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { AppModule } from "@src/app.module";
import { WORDS_BOX_NOT_FOUND } from "@src/common/errors";
import { ROUTES } from "@src/common/routes/routes";
import { URL_REPLACE_PARAMS } from "@src/common/utils";
import { UserEntity, } from "@src/entities";
import { createUser } from "@test/helper";
import { createWordsBox } from "@test/helper/createWordsBox.helper";
import { options } from "ormconfig";
import * as request from 'supertest';
import { EntityManager, DataSource } from "typeorm";

const URL = ROUTES.WORDS_BOX.ROOT + ROUTES.WORDS_BOX.DELETE_WORDS_BOX.URL

let dataSource: DataSource;
describe(ROUTES.WORDS_BOX.DELETE_WORDS_BOX.DESCRIPTION, () => {
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

    it("should delete words box", async () => {
        const { token, user } = await createUser(manager)

        const wordsBox = await createWordsBox(manager, { user })
       
        const response = await request(app.getHttpServer())
            .delete(URL_REPLACE_PARAMS(URL, { [ROUTES.WORDS_BOX.DELETE_WORDS_BOX.PARAM]: wordsBox.id }))
            .auth(token, { type: 'bearer' })

        const getUser = await manager.findOne(UserEntity, {
            where: { id: user.id },
            relations: {
                wordsBoxes: true
            }
        })
        
        expect(response.body.id).toEqual(wordsBox.id)
        expect(response.body.is_deleted).toEqual(true)
        expect(getUser.wordsBoxes).toHaveProperty("length", 0)

    })
    it("should throw an error WORDS_BOX_NOT_FOUND", async () => {
        const { token, user } = await createUser(manager)

        const response = await request(app.getHttpServer())
            .delete(URL_REPLACE_PARAMS(URL, { [ROUTES.WORDS_BOX.UPDATE_ADD_WORDS_TO_BOX.PARAM]: faker.string.uuid() }))
            .auth(token, { type: 'bearer' })
            

        expect(response.status).toEqual(404)
        expect(response.body.message).toEqual(WORDS_BOX_NOT_FOUND.description)
        expect(response.body.statusCode).toEqual(WORDS_BOX_NOT_FOUND.status)
    })
});