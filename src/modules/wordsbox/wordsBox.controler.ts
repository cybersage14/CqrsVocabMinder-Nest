import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateWordsBoxRequestDto } from "./dto";
import { CurrentUser } from "@src/common/decorator/current-user.decorator";
import { CreateWordsBoxCommand } from "./commands/impl/create-words-box.command";
import { ApiProperty, ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "@src/common/guard/jwt-guard";

@Controller('/words-box')
export class WordsBoxController{
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ){}

    @ApiProperty({})
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post()
    createWordsBox(
        @Body() createWordRequestDto:CreateWordsBoxRequestDto,
        @CurrentUser() userId: string
    ){
        return this.commandBus.execute(new CreateWordsBoxCommand(userId, createWordRequestDto));
    }
}