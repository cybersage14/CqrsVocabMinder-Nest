import { INestApplication } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { AppModule } from "@src/app.module";
import { BOX_ALREADY_EXISTS } from "@src/common/errors";
import { ROUTES } from "@src/common/routes/routes";
import { UserEntity, } from "@src/entities";
import { CreateWordsBoxRequestDto } from "@src/modules/wordsbox/dto";
import { createUser } from "@test/helper";
import { createWordsBox } from "@test/helper/createWordsBox.helper";
import { options } from "ormconfig";
import * as request from 'supertest';
import { EntityManager, DataSource } from "typeorm";

const URL = ROUTES.WORDS_BOX.ROOT + ROUTES.WORDS_BOX.CREATE_WORDS_BOX.URL

let dataSource: DataSource;
describe(ROUTES.WORDS_BOX.CREATE_WORDS_BOX.DESCRIPTION, () => {
  let app: INestApplication;
  let manager: EntityManager;

  let createWordsBoxRequestDto: CreateWordsBoxRequestDto

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

  it("should create words box", async () => {
    const { token, user } = await createUser(manager)

    createWordsBoxRequestDto = {
      name: "test"
    }

    const response = await request(app.getHttpServer())
      .post(URL)
      .auth(token, { type: 'bearer' })
      .send(createWordsBoxRequestDto).expect(201)

    const getUser = await manager.findOne(UserEntity, {
      where: {
        id: user.id
      },
      relations: {
        wordsBoxes: true
      }
    })

    expect(getUser.wordsBoxes[0].id).toEqual(response.body.id)
    expect(getUser.id).toEqual(response.body.user.id)
    expect(response.body.name).toEqual(createWordsBoxRequestDto.name)
  })
  it('should throw error BOX_ALREADY_EXISTS', async () => {
    const { token, user } = await createUser(manager)

    createWordsBoxRequestDto = {
      name: "test"
    }
    const wordsBox = await createWordsBox(manager, { name: createWordsBoxRequestDto.name, user,})

    const response = await request(app.getHttpServer())
      .post(URL)
      .auth(token, { type: 'bearer' })
      .send(createWordsBoxRequestDto).expect(409)

    expect(response.body.statusCode).toEqual(BOX_ALREADY_EXISTS.status)
    expect(response.body.message).toEqual(BOX_ALREADY_EXISTS.description)

  })
});