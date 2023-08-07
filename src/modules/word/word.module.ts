import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { CommandHandler } from "./commands/handler";
import { WordController } from "./word.controler";
import { QueryHandler } from "./queries/handler";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WordEntity } from "../../entities";

@Module({
    imports: [
        CqrsModule,
    TypeOrmModule.forFeature([WordEntity])
    ],
    controllers: [WordController],
    providers: [...CommandHandler,...QueryHandler],
})
export class WordModule {}