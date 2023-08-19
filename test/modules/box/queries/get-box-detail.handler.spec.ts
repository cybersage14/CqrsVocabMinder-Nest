import { INestApplication } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { AppModule } from "@src/app.module";
import { ROUTES } from "@src/common/routes/routes";
import { URL_REPLACE_PARAMS } from "@src/common/utils";
import { createUser } from "@test/helper";
import { createBox } from "@test/helper/create-box.handler";
import { options } from "ormconfig";
import * as request from 'supertest';
import { EntityManager, DataSource } from "typeorm";

const URL = ROUTES.BOX.ROOT + ROUTES.BOX.GET_BOX_DETAIL.URL

let dataSource: DataSource;
describe(ROUTES.BOX.GET_BOX_DETAIL.DESCRIPTION, () => {
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

    it("should get box by id", async () => {
        const { token, user } = await createUser(manager)
        const Box = await createBox(manager, { user })
        const response = await request(app.getHttpServer())
            .get(URL_REPLACE_PARAMS(URL, { [ROUTES.BOX.GET_BOX_DETAIL.PARAM]: Box.id }))
            .auth(token, { type: 'bearer' })
            .expect(200)

        expect(response.body.id).toEqual(Box.id)
        expect(response.body.name).toEqual(Box.name)
        expect(response.body.wordsBoxes).toBeDefined()
    })
});