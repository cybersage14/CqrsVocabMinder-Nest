import { INestApplication } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { AppModule } from "@src/app.module";
import { IPaginate } from "@src/common/interfaces/paginate";
import { ROUTES } from "@src/common/routes/routes";
import { WordEntity } from "@src/entities";
import { GetWordsRequestDto } from "@src/modules/wordsBox/dto";
import { createUser, createWord } from "@test/helper";
import { options } from "ormconfig";
import * as request from 'supertest';
import { EntityManager, DataSource } from "typeorm";

const URL = ROUTES.WORD.ROOT + ROUTES.WORD.GET_WORDS.URL

let dataSource: DataSource;
describe(ROUTES.WORD.GET_WORDS.DESCRIPTION, () => {
  let query: GetWordsRequestDto
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
  it("should get all words", async () => {
    const { token, user } = await createUser(manager);
    const count = 15
    for (let i = 0; i < count; i++) {
      const word = await createWord(manager, { user })
    }

    query = {
      limit: 5,
      page: 2,
    }

    const response = await request(app.getHttpServer())
      .get(URL)
      .auth(token, { type: 'bearer' }).query(query)
      .expect(200)

    const { items, meta } = response.body as IPaginate<WordEntity>

    expect(meta.totalItems).toEqual(count)
    expect(meta.itemCount).toEqual(items.length)
    expect(meta.currentPage).toEqual(query.page)
    expect(meta.itemsPerPage).toEqual(query.limit)
    expect(meta.totalPages).toEqual(Math.ceil(count / query.limit));
    expect(meta.currentPage).toEqual(query.page)
  })
  it("should search words", async () => {
    const { token, user } = await createUser(manager);
    const word = await createWord(manager, { user })
    query = {
      search: word.word
    }

    const response = await request(app.getHttpServer())
      .get(URL)
      .auth(token, { type: 'bearer' }).query(query)
      .expect(200)
      
      const { items, meta } = response.body as IPaginate<WordEntity>
     
      expect(items[0].word).toEqual(query.search)
      expect(meta.totalItems).toEqual(items.length)
  })
});