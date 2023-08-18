import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiTags } from "@nestjs/swagger";
import { CreateWordRequestDto } from "./dto/create-word.request.dto";
import { CreateWordCommand, DeleteWordCommand, UpdateWordCommand } from "./commands/impl";
import { CurrentUser } from "../../common/decorator/current-user.decorator";
import { JwtAuthGuard } from "./../../common/guard/jwt-guard";
import { GetWordQuery, GetWordsQuery } from "./queries/impl";
import { GetWordsRequestDto } from "./dto/get-words.request.dto";
import { UpdateWordRequestDto } from "./dto/update-word.request.dto";
import { ROUTES } from "@src/common/routes/routes";

@Controller(ROUTES.WORD.ROOT)
@ApiTags(ROUTES.WORD.ROOT)
export class WordController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) { }

    @Post(ROUTES.WORD.CREATE_WORD.URL)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        description: ROUTES.WORD.CREATE_WORD.DESCRIPTION
    })
    async createWord(
        @CurrentUser() userId: string,
        @Body() createWordRequestDto: CreateWordRequestDto
    ) {
        return await this.commandBus.execute(new CreateWordCommand(userId, createWordRequestDto));
    }

    @Get(ROUTES.WORD.GET_WORDS.URL)
    @ApiOperation({
        description: ROUTES.WORD.GET_WORDS.DESCRIPTION
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async getWords(
        @Query() query: GetWordsRequestDto,
        @CurrentUser() userId: string
    ) {
        return await this.queryBus.execute(new GetWordsQuery(userId, query));
    }

    @Get(ROUTES.WORD.GET_WORD_BY_ID.URL)
    @ApiBearerAuth()
    @ApiOperation({
        description: ROUTES.WORD.GET_WORD_BY_ID.DESCRIPTION
    })
    @UseGuards(JwtAuthGuard)
    async getWord(
        @CurrentUser() userId: string,
        @Param(ROUTES.WORD.GET_WORD_BY_ID.PARAM) wordId: string
    ) {
        return await this.queryBus.execute(new GetWordQuery(userId, wordId));
    }

    @Put(ROUTES.WORD.UPDATE_WORD_BY_ID.URL)
    @ApiOperation({
        description: ROUTES.WORD.GET_WORD_BY_ID.DESCRIPTION
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async updateWord(
        @Body() updateWordRequestDto: UpdateWordRequestDto,
        @Param(ROUTES.WORD.UPDATE_WORD_BY_ID.PARAM, new ParseUUIDPipe({ version: '4' })) wordId: string,
        @CurrentUser() userId: string
    ) {
        return await this.commandBus.execute(new UpdateWordCommand(wordId, userId, updateWordRequestDto))
    }

    @Delete(ROUTES.WORD.DELETE_WORD_BY_ID.URL)
    @ApiBearerAuth()
    @ApiOperation({
        description: ROUTES.WORD.DELETE_WORD_BY_ID.DESCRIPTION
    })
    @UseGuards(JwtAuthGuard)
    async deleteWord(
        @CurrentUser() userId: string,
        @Param(ROUTES.WORD.DELETE_WORD_BY_ID.PARAM, new ParseUUIDPipe({ version: '4' })) wordId: string
    ) {
        return await this.commandBus.execute(new DeleteWordCommand(userId, wordId))
    }
}