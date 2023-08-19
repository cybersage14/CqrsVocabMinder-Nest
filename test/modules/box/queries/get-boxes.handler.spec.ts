import { INestApplication } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { AppModule } from "@src/app.module";
import { IPaginate } from "@src/common/interfaces/paginate";
import { ROUTES } from "@src/common/routes/routes";
import { BoxEntity, } from "@src/entities";
import { GetBoxesRequestDto } from "@src/modules/box/dto";
import { createUser } from "@test/helper";
import { createBox } from "@test/helper/create-box.handler";
import { options } from "ormconfig";
import * as request from 'supertest';
import { EntityManager, DataSource } from "typeorm";

const URL = ROUTES.BOX.ROOT + ROUTES.BOX.GET_ALL_BOX.URL

let dataSource: DataSource;
describe(ROUTES.BOX.GET_ALL_BOX.DESCRIPTION, () => {
    let app: INestApplication;

    let manager: EntityManager;
    let query: GetBoxesRequestDto

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

    it("should get all box", async () => {
        const { token, user } = await createUser(manager)

        const count = 15

        for (let i = 0; i < count; i++) {
            const Box = await createBox(manager, { user })
        }
        query = {
            page: 2,
            limit: 5,
        }

        const response = await request(app.getHttpServer())
            .get(URL)
            .auth(token, { type: 'bearer' }).query(query)
            .expect(200)

        const { items, meta } = response.body as IPaginate<BoxEntity>

        expect(meta.totalItems).toEqual(count)
        expect(meta.itemCount).toEqual(items.length)
        expect(meta.currentPage).toEqual(query.page)
        expect(meta.itemsPerPage).toEqual(query.limit)
        expect(meta.totalPages).toEqual(Math.ceil(count / query.limit));
        expect(meta.currentPage).toEqual(query.page)
    })
    it('get box by name', async () => {
        const { token, user } = await createUser(manager)
        await createBox(manager, { user, name: "test" })
        query = {
            search: "test"
        }
        const response = await request(app.getHttpServer())
            .get(URL)
            .auth(token, { type: 'bearer' })
            .query(query).expect(200)

        expect(response.body.items[0].name).toEqual(query.search)
        expect(response.body.meta.totalItems).toEqual(1)
    })
});