import { faker } from "@faker-js/faker";
import { INestApplication } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { AppModule } from "@src/app.module";
import { WORDS_BOX_NOT_FOUND } from "@src/common/errors";
import { ROUTES } from "@src/common/routes/routes";
import { URL_REPLACE_PARAMS } from "@src/common/utils";
import { UserEntity, } from "@src/entities";
import { UpdateWordsBoxRequestDto } from "@src/modules/wordsBox/dto";
import { createUser } from "@test/helper";
import { createWordsBox } from "@test/helper/createWordsBox.helper";
import { options } from "ormconfig";
import * as request from 'supertest';
import { EntityManager, DataSource } from "typeorm";

const URL = ROUTES.WORDS_BOX.ROOT + ROUTES.WORDS_BOX.UPDATE_WORDS_BOX.URL

let dataSource: DataSource;
describe(ROUTES.WORDS_BOX.UPDATE_WORDS_BOX.DESCRIPTION, () => {
    let app: INestApplication;
    let manager: EntityManager;

    let updateWordsBoxRequestDto: UpdateWordsBoxRequestDto

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

    it("should update words box", async () => {
        const { token, user } = await createUser(manager)
        const wordsBox = await createWordsBox(manager, { user })

        updateWordsBoxRequestDto = {
            is_learned: true,
            name: "test"
        }

        const response = await request(app.getHttpServer())
            .put(URL_REPLACE_PARAMS(URL, { [ROUTES.WORDS_BOX.UPDATE_WORDS_BOX.PARAM]: wordsBox.id }))
            .auth(token, { type: 'bearer' })
            .send(updateWordsBoxRequestDto)
        
        const getUser = await manager.findOne(UserEntity, {
            where: {
                id: user.id
            },
            relations: {
                wordsBoxes: true
            }
        })

        expect(getUser.wordsBoxes[0].id).toEqual(response.body.id)
        expect(response.body.name).toEqual(updateWordsBoxRequestDto.name)
    })
    it('should throw error WORDS_BOX_NOT_FOUND', async () => {
        const { token, user } = await createUser(manager)

        updateWordsBoxRequestDto = {
            name: "test",
            is_learned: true
        }

        const response = await request(app.getHttpServer())
            .put(URL_REPLACE_PARAMS(URL, { [ROUTES.WORDS_BOX.UPDATE_WORDS_BOX.PARAM]: faker.string.uuid() }))
            .auth(token, { type: 'bearer' })
            .send(updateWordsBoxRequestDto)

        expect(response.body.statusCode).toEqual(WORDS_BOX_NOT_FOUND.status)
        expect(response.body.message).toEqual(WORDS_BOX_NOT_FOUND.description)
    })
});