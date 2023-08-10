import { Body, Controller, Delete, Param, ParseUUIDPipe, Post, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { AddWordToBoxRequestDto, CreateWordsBoxRequestDto } from "./dto";
import { CurrentUser } from "@src/common/decorator/current-user.decorator";
import { CreateWordsBoxCommand } from "./commands/impl/create-words-box.command";
import { ApiProperty, ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "@src/common/guard/jwt-guard";
import { AddWordToBox } from "./commands/impl/add-word-to-box.command";
import { DeleteWordsBoxCommand } from "./commands/impl";

@ApiTags('words-box')
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

    @ApiProperty({})
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post('/add-word-to-box/:boxId')
    addWordToBox(
        @Body() addWordToBoxRequestDto: AddWordToBoxRequestDto,
        @Param('boxId',new ParseUUIDPipe({version:'4'})) boxId: string,
        @CurrentUser() userId: string,
    ){
        return this.commandBus.execute(new AddWordToBox(userId,boxId,addWordToBoxRequestDto));
    }

    @ApiProperty({})
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete('/:boxId')
    deleteWordsBox(
        @Param('boxId',new ParseUUIDPipe({version:'4'})) wordsBoxId: string,
        @CurrentUser() userId: string,
    ){
        return this.commandBus.execute(new DeleteWordsBoxCommand(userId,wordsBoxId));
    }

}