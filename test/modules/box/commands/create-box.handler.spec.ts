import { INestApplication } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { AppModule } from "@src/app.module";
import { BOX_ALREADY_EXISTS } from "@src/common/errors";
import { ROUTES } from "@src/common/routes/routes";
import { UserEntity, } from "@src/entities";
import { CreateBoxRequestDto } from "@src/modules/box/dto";
import { createUser } from "@test/helper";
import { createBox } from "@test/helper/create-box.handler";
import { options } from "ormconfig";
import * as request from 'supertest';
import { EntityManager, DataSource } from "typeorm";

const URL = ROUTES.BOX.ROOT + ROUTES.BOX.CREATE_BOX.URL

let dataSource: DataSource;
describe(ROUTES.BOX.CREATE_BOX.DESCRIPTION, () => {
    let app: INestApplication;
    let manager: EntityManager;

    let createBoxRequestDto: CreateBoxRequestDto

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

    it("should create box", async () => {
        const { token, user } = await createUser(manager)

        createBoxRequestDto = {
            name: "test"
        }

        const response = await request(app.getHttpServer())
            .post(URL)
            .auth(token, { type: 'bearer' })
            .send(createBoxRequestDto).expect(201)

        const getUser = await manager.findOne(UserEntity, {
            where: { id: user.id, }, relations: {
                box: true
            }
        })

        expect(response.body.id).toEqual(getUser.box[0].id)
        expect(getUser.box[0].name).toEqual(createBoxRequestDto.name)

    })
    it('should throw error BOX_ALREADY_EXISTS', async () => {
        const { token, user } = await createUser(manager)

        await createBox(manager, { user, name: "test" })

        createBoxRequestDto = {
            name: "test"
        }
        const response = await request(app.getHttpServer())
            .post(URL)
            .auth(token, { type: 'bearer' })
            .send(createBoxRequestDto).expect(409)

        expect(response.body.statusCode).toEqual(BOX_ALREADY_EXISTS.status)
        expect(response.body.message).toEqual(BOX_ALREADY_EXISTS.description)

    })
});