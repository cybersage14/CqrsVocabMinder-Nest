import { faker } from "@faker-js/faker";
import { INestApplication } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { AppModule } from "@src/app.module";
import { BOX_ALREADY_EXISTS, WORDS_BOX_NOT_FOUND, WORD_NOT_FOUND, WORD_NOT_YOUR_BOX } from "@src/common/errors";
import { ROUTES } from "@src/common/routes/routes";
import { URL_REPLACE_PARAMS } from "@src/common/utils";
import { UserEntity, } from "@src/entities";
import { CreateWordsBoxRequestDto, RemoveWordsRequestDto } from "@src/modules/wordsbox/dto";
import { createUser, createWord } from "@test/helper";
import { createWordsBox } from "@test/helper/createWordsBox.helper";
import { options } from "ormconfig";
import * as request from 'supertest';
import { EntityManager, DataSource } from "typeorm";

const URL = ROUTES.WORDS_BOX.ROOT + ROUTES.WORDS_BOX.REMOVE_WORD_FROM_WORDS_BOX.URL

let dataSource: DataSource;
describe(ROUTES.WORDS_BOX.REMOVE_WORD_FROM_WORDS_BOX.DESCRIPTION, () => {
  let app: INestApplication;
  let manager: EntityManager;

  let removeWordsRequestDto: RemoveWordsRequestDto

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

  it("should remove words from box", async () => {
    const { token, user } = await createUser(manager)

    const words = []
    for (let i = 0; i < 10; i++) {
      const word = await createWord(manager, { user })
      words.push(word)
    }

    const wordsBox = await createWordsBox(manager, { user, words: words })

    removeWordsRequestDto = {
      wordsIds: words.map(word => word.id)
    }

    const response = await request(app.getHttpServer())
      .put(URL_REPLACE_PARAMS(URL, { [ROUTES.WORDS_BOX.REMOVE_WORD_FROM_WORDS_BOX.PARAM]: wordsBox.id }))
      .auth(token, { type: 'bearer' })
      .send(removeWordsRequestDto)

    const getUser = await manager.findOne(UserEntity, {
      where: {
        id: user.id
      },
      relations: {
        wordsBoxes: true
      }
    })

    expect(response.body.id).toEqual(getUser.wordsBoxes[0].id)
    expect(wordsBox.id).toEqual(response.body.id)
    expect(response.body.words).toHaveProperty("length", 0)
  })
  it('should throw error WORD_NOT_FOUND', async () => {
    const { token, user } = await createUser(manager)

    const wordsBox = await createWordsBox(manager, { user })

    removeWordsRequestDto = {
      wordsIds: [faker.string.uuid()]
    }

    const response = await request(app.getHttpServer())
      .put(URL_REPLACE_PARAMS(URL, { [ROUTES.WORDS_BOX.REMOVE_WORD_FROM_WORDS_BOX.PARAM]: wordsBox.id }))
      .auth(token, { type: 'bearer' })
      .send(removeWordsRequestDto)

    expect(response.status).toEqual(404)
    expect(response.body.message).toEqual(WORD_NOT_FOUND.description)
    expect(response.body.statusCode).toEqual(WORD_NOT_FOUND.status)
  })
  it('should throw error WORDS_BOX_NOT_FOUND', async () => {
    const { token, user } = await createUser(manager)

    removeWordsRequestDto = {
      wordsIds: []
    }
    const response = await request(app.getHttpServer())
      .put(URL_REPLACE_PARAMS(URL, { [ROUTES.WORDS_BOX.REMOVE_WORD_FROM_WORDS_BOX.PARAM]: faker.string.uuid() }))
      .auth(token, { type: 'bearer' }).send(removeWordsRequestDto)

    expect(response.status).toEqual(404)
    expect(response.body.message).toEqual(WORDS_BOX_NOT_FOUND.description)
    expect(response.body.statusCode).toEqual(WORDS_BOX_NOT_FOUND.status)
  })
  it('should throw error WORD_NOT_YOUR_BOX', async () => {
    const { token, user } = await createUser(manager)
    const wordsBox = await createWordsBox(manager, { user })
    const word = await createWord(manager, { user })

    removeWordsRequestDto = {
      wordsIds: [word.id]
    }
    const response = await request(app.getHttpServer())
      .put(URL_REPLACE_PARAMS(URL, { [ROUTES.WORDS_BOX.REMOVE_WORD_FROM_WORDS_BOX.PARAM]: wordsBox.id }))
      .auth(token, { type: 'bearer' }).send(removeWordsRequestDto)

    expect(response.body.message).toEqual(WORD_NOT_YOUR_BOX.description)
    expect(response.body.statusCode).toEqual(WORD_NOT_YOUR_BOX.status)
  })
});