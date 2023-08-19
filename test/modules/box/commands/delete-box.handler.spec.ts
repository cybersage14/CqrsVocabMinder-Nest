import { faker } from "@faker-js/faker";
import { INestApplication } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { AppModule } from "@src/app.module";
import { BOX_ALREADY_EXISTS, BOX_NOT_FOUND } from "@src/common/errors";
import { ROUTES } from "@src/common/routes/routes";
import { URL_REPLACE_PARAMS } from "@src/common/utils";
import { UserEntity, } from "@src/entities";
import { CreateBoxRequestDto } from "@src/modules/box/dto";
import { createUser } from "@test/helper";
import { createBox } from "@test/helper/create-box.handler";
import { options } from "ormconfig";
import * as request from 'supertest';
import { EntityManager, DataSource } from "typeorm";

const URL = ROUTES.BOX.ROOT + ROUTES.BOX.DELETE_BOX.URL

let dataSource: DataSource;
describe(ROUTES.BOX.CREATE_BOX.DESCRIPTION, () => {
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

    it("should delete box", async () => {
        const { token, user } = await createUser(manager)

        const box = await createBox(manager, { user })

        const response = await request(app.getHttpServer())
            .delete(URL_REPLACE_PARAMS(URL, { [ROUTES.BOX.DELETE_BOX.PARAM]: box.id }))
            .auth(token, { type: 'bearer' })

        const getUser = await manager.findOne(UserEntity, {
            where: { id: user.id, }, relations: {
                box: true
            }
        })
        expect(response.body.is_deleted).toEqual(true)
        expect(response.body.id).toEqual(box.id)
        expect(getUser.box).toHaveProperty("length", 0)
    })
    it('should throw error BOX_NOT_FOUND', async () => {
        const { token, user } = await createUser(manager)

        const response = await request(app.getHttpServer())
            .delete(URL_REPLACE_PARAMS(URL, { [ROUTES.BOX.DELETE_BOX.PARAM]: faker.string.uuid() }))
            .auth(token, { type: 'bearer' })

        expect(response.body.statusCode).toEqual(BOX_NOT_FOUND.status)
        expect(response.body.message).toEqual(BOX_NOT_FOUND.description)
    })
});