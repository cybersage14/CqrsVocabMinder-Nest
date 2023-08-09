import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, Query, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiProperty, ApiTags } from "@nestjs/swagger";
import { CreateWordRequestDto } from "./dto/create-word.request.dto";
import { CreateWordCommand, UpdateWordCommand } from "./commands/impl";
import { CurrentUser } from "../../common/decorator/current-user.decorator";
import { JwtAuthGuard } from "./../../common/guard/jwt-guard";
import { GetWordsQuery } from "./queries/impl";
import { GetWordsRequestDto } from "./dto/get-words.request.dto";
import { UpdateWordRequestDto } from "./dto/update-word.request.dto";

@Controller('/word')
@ApiTags('word')
export class WordController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) { }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiProperty({})
    @Post()
    async createWord(
        @CurrentUser() userId: string,
        @Body() createWordRequestDto: CreateWordRequestDto
    ) {
        return await this.commandBus.execute(new CreateWordCommand(userId, createWordRequestDto));
    }

    @Get()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async getWords(
        @Query() query: GetWordsRequestDto,
        @CurrentUser() userId: string
    ) {
        return await this.queryBus.execute(new GetWordsQuery(userId, query));
    }

    @Put("/:wordId")
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async UpdateWord(
        @Body() updateWordRequestDto: UpdateWordRequestDto,
        @Param('wordId', new ParseUUIDPipe({ version: '4' })) id: string
    ) {
        return await this.commandBus.execute(new UpdateWordCommand(id,updateWordRequestDto))
    }
}