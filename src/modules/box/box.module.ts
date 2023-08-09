import { Module } from "@nestjs/common";
import { CommandHandler } from "./commands/handler";
import { BoxController } from "./box.controller";
import { CqrsModule } from "@nestjs/cqrs";
import { BoxEntity } from "@src/entities";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QueryHandler } from "./queries/query";

@Module({
    imports: [
        CqrsModule,
        TypeOrmModule.forFeature([BoxEntity])
    ],
    controllers: [BoxController],
    providers: [...CommandHandler,...QueryHandler],
    exports: []
})
export class BoxModule { }