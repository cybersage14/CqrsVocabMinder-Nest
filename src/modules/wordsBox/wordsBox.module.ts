import { Module } from "@nestjs/common";
import { WordsBoxController } from "./wordsBox.controler";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WordsBoxEntity } from "@src/entities";
import { CommandHandler } from "./commands/handler";
import { QueryHandler } from "./queries/handler";

@Module({
    imports: [CqrsModule,TypeOrmModule.forFeature([WordsBoxEntity])],
    controllers:[WordsBoxController],
    providers: [...CommandHandler,...QueryHandler],
})
export class WordsBoxModule {}