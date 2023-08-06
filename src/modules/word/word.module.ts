import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { CommandHandler } from "./commands/handler";
import { WordController } from "./word.controler";

@Module({
    imports: [CqrsModule],
    controllers: [WordController],
    providers: [...CommandHandler],
})
export class WordModule {}