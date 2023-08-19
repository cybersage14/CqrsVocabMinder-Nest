import { faker } from "@faker-js/faker";
import { INestApplication } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { AppModule } from "@src/app.module";
import { BOX_ALREADY_EXISTS, BOX_NOT_FOUND, WORDS_BOX_NOT_FOUND, WORDS_BOX_NOT_IN_YOUR_BOX } from "@src/common/errors";
import { ROUTES } from "@src/common/routes/routes";
import { URL_REPLACE_PARAMS } from "@src/common/utils";
import { BoxEntity, UserEntity, } from "@src/entities";
import { CreateBoxRequestDto, RemoveWordsBoxFromBoxRequestDto } from "@src/modules/box/dto";
import { createUser } from "@test/helper";
import { createBox } from "@test/helper/create-box.handler";
import { createWordsBox } from "@test/helper/createWordsBox.helper";
import { options } from "ormconfig";
import * as request from 'supertest';
import { EntityManager, DataSource } from "typeorm";

const URL = ROUTES.BOX.ROOT + ROUTES.BOX.REMOVE_WORDS_BOX_FROM_BOX.URL

let dataSource: DataSource;
describe(ROUTES.BOX.REMOVE_WORDS_BOX_FROM_BOX.DESCRIPTION, () => {
    let app: INestApplication;
    let manager: EntityManager;

    let removeWordsBoxFromBoxRequestDto: RemoveWordsBoxFromBoxRequestDto

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

    it("should remove words boxes from box", async () => {
        const { token, user } = await createUser(manager)

        const wordsBoxArray = []
        for (let i = 0; i < 5; i++) {
            const wordsBox = await createWordsBox(manager, { user })
            wordsBoxArray.push(wordsBox)
        }
        const box = await createBox(manager, { user, wordsBoxes: wordsBoxArray })

        removeWordsBoxFromBoxRequestDto = {
            wordsBoxIds: wordsBoxArray.map(wordsBox => wordsBox.id)
        }
        const response = await request(app.getHttpServer())
            .put(URL_REPLACE_PARAMS(URL, { [ROUTES.BOX.REMOVE_WORDS_BOX_FROM_BOX.PARAM]: box.id }))
            .auth(token, { type: 'bearer' })
            .send(removeWordsBoxFromBoxRequestDto)

        const getBox = await manager.findOne(BoxEntity, {
            where: { id: box.id, },
            relations: {
                wordsBoxes: true
            }
        })
        console.log(getBox.wordsBoxes);

        console.log(response.body);

        expect(response.body.wordsBoxes).toEqual(getBox.wordsBoxes)
        expect(response.body.id).toEqual(box.id)


    })
    it('should throw error BOX_NOT_FOUND', async () => {
        const { token, user } = await createUser(manager)

        const response = await request(app.getHttpServer())
            .put(URL_REPLACE_PARAMS(URL, { [ROUTES.BOX.REMOVE_WORDS_BOX_FROM_BOX.PARAM]: faker.string.uuid() }))
            .auth(token, { type: 'bearer' })
            .send(removeWordsBoxFromBoxRequestDto)

        expect(response.body.statusCode).toEqual(BOX_NOT_FOUND.status)
        expect(response.body.message).toEqual(BOX_NOT_FOUND.description)
    })
    it('should throw error WORDS_BOX_NOT_IN_YOUR_BOX', async () => {
        const { token, user } = await createUser(manager)

        const box = await createBox(manager, { user, })

        const wordsBox = await createWordsBox(manager, { user })
        removeWordsBoxFromBoxRequestDto = {
            wordsBoxIds: [wordsBox.id]
        }
        const response = await request(app.getHttpServer())
            .put(URL_REPLACE_PARAMS(URL, { [ROUTES.BOX.REMOVE_WORDS_BOX_FROM_BOX.PARAM]: box.id }))
            .auth(token, { type: 'bearer' })
            .send(removeWordsBoxFromBoxRequestDto)

        expect(response.body.statusCode).toEqual(WORDS_BOX_NOT_IN_YOUR_BOX.status)
        expect(response.body.message).toEqual(WORDS_BOX_NOT_IN_YOUR_BOX.description)
    })
    it('should throw error WORDS_BOX_NOT_FOUND', async () => {
        const { token, user } = await createUser(manager)

        const box = await createBox(manager, { user, })

        const wordsBox = await createWordsBox(manager, { user })
        removeWordsBoxFromBoxRequestDto = {
            wordsBoxIds: [faker.string.uuid()]
        }
        const response = await request(app.getHttpServer())
            .put(URL_REPLACE_PARAMS(URL, { [ROUTES.BOX.REMOVE_WORDS_BOX_FROM_BOX.PARAM]: box.id }))
            .auth(token, { type: 'bearer' })
            .send(removeWordsBoxFromBoxRequestDto)

        expect(response.body.statusCode).toEqual(WORDS_BOX_NOT_FOUND.status)
        expect(response.body.message).toEqual(WORDS_BOX_NOT_FOUND.description)
    })
});