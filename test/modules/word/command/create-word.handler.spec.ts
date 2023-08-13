import { INestApplication } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { AppModule } from "@src/app.module";
import { ROUTES } from "@src/common/routes/routes";
import { UserEntity, WordEntity } from "@src/entities";
import { CreateWordRequestDto } from "@src/modules/word/dto";
import { createUser } from "@test/helper/createUser.helper";
import { options } from "ormconfig";
import * as request from 'supertest';
import { EntityManager, DataSource } from "typeorm";

const URL = ROUTES.WORD.ROOT + ROUTES.WORD.CREATE_WORD.URL

let dataSource: DataSource;
describe(ROUTES.WORD.CREATE_WORD.DESCRIPTION, () => {
  let app: INestApplication;
  let manager: EntityManager;

  let createWordRequestDto: CreateWordRequestDto

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
  it("should create word", async () => {
    const { token, user } = await createUser(manager);
    createWordRequestDto = {
      definition: "test",
      example: "test",
      usage: "test",
      pronounce: "test",
      word: "test"
    }
    const response = await request(app.getHttpServer())
      .post(URL)
      .auth(token, { type: 'bearer' })
      .send(createWordRequestDto).expect(201)
    const getUser =await manager.findOne(UserEntity,{
      where:{
        id:user.id
      },
      relations:{
        words:true
      }
    })
    expect(getUser.id).toEqual(response.body.user.id);
    expect(getUser.words[0].id).toEqual(response.body.id);
    expect(user.id).toEqual(response.body.user.id);
    expect(response.body.word).toEqual(createWordRequestDto.word);
  })
});