import { INestApplication } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { AppModule } from "@src/app.module";
import { IPaginate } from "@src/common/interfaces/paginate";
import { ROUTES } from "@src/common/routes/routes";
import { WordsBoxEntity, } from "@src/entities";
import { GetWordsRequestDto } from "@src/modules/wordsBox/dto";
import { createUser } from "@test/helper";
import { createWordsBox } from "@test/helper/createWordsBox.helper";
import { options } from "ormconfig";
import * as request from 'supertest';
import { EntityManager, DataSource } from "typeorm";

const URL = ROUTES.WORDS_BOX.ROOT + ROUTES.WORDS_BOX.GET_ALL_WORDS_BOX.URL

let dataSource: DataSource;
describe(ROUTES.WORDS_BOX.CREATE_WORDS_BOX.DESCRIPTION, () => {
    let app: INestApplication;
    let manager: EntityManager;
    let query: GetWordsRequestDto

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

    it("should get all words box", async () => {
        const { token, user } = await createUser(manager)
        const count = 15
        for (let i = 0; i < count; i++) {
            await createWordsBox(manager, { user })
        }
        query = {
            page: 2,
            limit: 5,
        }

        const response = await request(app.getHttpServer())
            .get(URL)
            .auth(token, { type: 'bearer' })
            .query(query).expect(200)

        const { items, meta } = response.body as IPaginate<WordsBoxEntity>

        expect(meta.totalItems).toEqual(count)
        expect(meta.itemCount).toEqual(items.length)
        expect(meta.currentPage).toEqual(query.page)
        expect(meta.itemsPerPage).toEqual(query.limit)
        expect(meta.totalPages).toEqual(Math.ceil(count / query.limit));
        expect(meta.currentPage).toEqual(query.page)
    })
    it('get word by name', async () => {
        const { token, user } = await createUser(manager)
        await createWordsBox(manager, { user, name: "test" })
        await createWordsBox(manager, { user, name: "nothing else matters" })
        
        query = {
            search: "test"
        }

        const response = await request(app.getHttpServer())
            .get(URL)
            .auth(token, { type: 'bearer' })
            .query(query).expect(200)

            expect(response.body.items[0].name).toEqual(query.search)
            expect(response.body.meta.totalItems).toEqual(1)
            expect(response.body.items).toHaveLength(1)    
    })
});