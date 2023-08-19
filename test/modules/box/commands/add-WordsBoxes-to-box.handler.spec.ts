import { faker } from "@faker-js/faker";
import { INestApplication } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { AppModule } from "@src/app.module";
import { BOX_NOT_FOUND, WORDS_BOX_NOT_FOUND } from "@src/common/errors";
import { ROUTES } from "@src/common/routes/routes";
import { URL_REPLACE_PARAMS } from "@src/common/utils";
import { UserEntity, } from "@src/entities";
import { AddWordsBoxesToBoxRequestDto } from "@src/modules/box/dto";
import { createUser } from "@test/helper";
import { createBox } from "@test/helper/create-box.handler";
import { createWordsBox } from "@test/helper/createWordsBox.helper";
import { options } from "ormconfig";
import * as request from 'supertest';
import { EntityManager, DataSource } from "typeorm";

const URL = ROUTES.BOX.ROOT + ROUTES.BOX.ADD_WORDS_BOX_TO_BOX.URL

let dataSource: DataSource;
describe(ROUTES.BOX.ADD_WORDS_BOX_TO_BOX.DESCRIPTION, () => {
    let app: INestApplication;
    let manager: EntityManager;

    let addWordsBoxesToBoxRequestDto: AddWordsBoxesToBoxRequestDto

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

    it("should add words-box to box", async () => {
        const { token, user } = await createUser(manager)

        const wordsBoxesId = []
        for (let i = 0; i < 10; i++) {
            const wordsBox = await createWordsBox(manager, { user })
            wordsBoxesId.push(wordsBox.id)
        }

        const box = await createBox(manager, { user, })

        addWordsBoxesToBoxRequestDto = {
            WordBoxIds: wordsBoxesId
        }
        const response = await request(app.getHttpServer())
            .put(URL_REPLACE_PARAMS(URL, { [ROUTES.BOX.ADD_WORDS_BOX_TO_BOX.PARAM]: box.id }))
            .auth(token, { type: 'bearer' })
            .send(addWordsBoxesToBoxRequestDto)

        const getUser = await manager.findOne(UserEntity, {
            where: { id: user.id, }, relations: {
                box: true,
                wordsBoxes: true
            }
        })

        response.body.wordsBoxes.forEach((box, index) => {
            expect(box.id).toEqual(wordsBoxesId[index]);
        });
        expect(box.id).toEqual(response.body.id)
        expect(response.body.name).toEqual(box.name);
        expect(getUser.box[0].id).toEqual(box.id)
    })
    it('should throw error BOX_NOT_FOUND', async () => {
        const { token, user } = await createUser(manager)

        addWordsBoxesToBoxRequestDto = {
            WordBoxIds: []
        }

        const response = await request(app.getHttpServer())
            .put(URL_REPLACE_PARAMS(URL, { [ROUTES.BOX.ADD_WORDS_BOX_TO_BOX.PARAM]: faker.string.uuid() }))
            .auth(token, { type: 'bearer' })
            .send(addWordsBoxesToBoxRequestDto)
        
        expect(response.body.message).toEqual(BOX_NOT_FOUND.description)
        expect(response.body.statusCode).toEqual(BOX_NOT_FOUND.status)

    })
    it('should throw error WORDS_BOX_NOT_FOUND', async () => {
        const { token, user } = await createUser(manager)

        addWordsBoxesToBoxRequestDto = {
            WordBoxIds: [faker.string.uuid()]
        }
        const box =await createBox(manager, { user })
        const response = await request(app.getHttpServer())
            .put(URL_REPLACE_PARAMS(URL, { [ROUTES.BOX.ADD_WORDS_BOX_TO_BOX.PARAM]: box.id }))
            .auth(token, { type: 'bearer' })
            .send(addWordsBoxesToBoxRequestDto)
        
        expect(response.body.message).toEqual(WORDS_BOX_NOT_FOUND.description)
        expect(response.body.statusCode).toEqual(WORDS_BOX_NOT_FOUND.status)
    })
});