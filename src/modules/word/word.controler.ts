import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiProperty, ApiTags } from "@nestjs/swagger";
import { CreateWordRequestDto } from "./dto/create-word.request.dto";
import { CreateWordCommand, DeleteWordCommand, UpdateWordCommand } from "./commands/impl";
import { CurrentUser } from "../../common/decorator/current-user.decorator";
import { JwtAuthGuard } from "./../../common/guard/jwt-guard";
import { GetWordQuery, GetWordsQuery } from "./queries/impl";
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
    @ApiProperty({})
    @UseGuards(JwtAuthGuard)
    async getWords(
        @Query() query: GetWordsRequestDto,
        @CurrentUser() userId: string
    ) {
        return await this.queryBus.execute(new GetWordsQuery(userId, query));
    }

    @Get('/:wordId')
    @ApiBearerAuth()
    @ApiProperty({})
    @UseGuards(JwtAuthGuard)
    async getWord(
        @CurrentUser() userId: string,
        @Param('wordId') wordId: string
    ) {
        return await this.queryBus.execute(new GetWordQuery(userId, wordId));
    }

    @Put("/:wordId")
    @ApiProperty({})
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async updateWord(
        @Body() updateWordRequestDto: UpdateWordRequestDto,
        @Param('wordId', new ParseUUIDPipe({ version: '4' })) wordId: string,
        @CurrentUser() userId: string
    ) {
        return await this.commandBus.execute(new UpdateWordCommand(wordId, userId, updateWordRequestDto))
    }

    @Delete("/:wordId")
    @ApiBearerAuth()
    @ApiProperty({})
    @UseGuards(JwtAuthGuard)
    async deleteWord(
        @CurrentUser() userId: string,
        @Param('wordId', new ParseUUIDPipe({ version: '4' })) wordId: string
    ) {
        return await this.commandBus.execute(new DeleteWordCommand(userId, wordId))
    }
}