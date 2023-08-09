import { Module } from "@nestjs/common";
import { CommandHandler } from "./commands/handler";
import { BoxController } from "./box.controller";
import { CqrsModule } from "@nestjs/cqrs";
import { BoxEntity } from "@src/entities";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        CqrsModule,
        TypeOrmModule.forFeature([BoxEntity])
    ],
    controllers: [BoxController],
    providers: [...CommandHandler],
    exports: []
})
export class BoxModule { }