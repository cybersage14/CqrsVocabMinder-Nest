import { faker } from "@faker-js/faker";
import { INestApplication } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { AppModule } from "@src/app.module";
import { BOX_NOT_FOUND } from "@src/common/errors";
import { ROUTES } from "@src/common/routes/routes";
import { URL_REPLACE_PARAMS } from "@src/common/utils";
import { UserEntity, } from "@src/entities";
import { UpdateBoxRequestDto } from "@src/modules/box/dto";
import { createUser } from "@test/helper";
import { createBox } from "@test/helper/create-box.handler";
import { options } from "ormconfig";
import * as request from 'supertest';
import { EntityManager, DataSource } from "typeorm";

const URL = ROUTES.BOX.ROOT + ROUTES.BOX.UPDATE_BOX.URL

let dataSource: DataSource;
describe(ROUTES.BOX.CREATE_BOX.DESCRIPTION, () => {
    let app: INestApplication;
    let manager: EntityManager;

    let updateBoxRequestDto: UpdateBoxRequestDto

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

    it("should update box", async () => {
        const { token, user } = await createUser(manager)
        const box =await createBox(manager, { user, name: "test22" })
        updateBoxRequestDto = {
            name: "test"
        }

        const response = await request(app.getHttpServer())
            .put(URL_REPLACE_PARAMS(URL, { [ROUTES.BOX.UPDATE_BOX.PARAM]: box.id }))
            .auth(token, { type: 'bearer' })
            .send(updateBoxRequestDto)

        const getUser = await manager.findOne(UserEntity, {
            where: { id: user.id, }, relations: {
                box: true
            }
        })
        expect(getUser.box[0].name).toEqual(updateBoxRequestDto.name)
        expect(response.body.name).toEqual(updateBoxRequestDto.name)
        expect(response.body.id).toEqual(box.id)

    })
    it('should throw error BOX_NOT_FOUND', async () => {
        const { token, user } = await createUser(manager)

        const response = await request(app.getHttpServer())
            .put(URL_REPLACE_PARAMS(URL, { [ROUTES.BOX.UPDATE_BOX.PARAM]: faker.string.uuid() }))
            .auth(token, { type: 'bearer' })
            .send(updateBoxRequestDto)

        expect(response.body.statusCode).toEqual(BOX_NOT_FOUND.status)
        expect(response.body.message).toEqual(BOX_NOT_FOUND.description)

    })
});