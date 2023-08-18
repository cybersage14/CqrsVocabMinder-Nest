import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { AddWordToBoxRequestDto, CreateWordsBoxRequestDto, GetWordsRequestDto, RemoveWordsRequestDto, UpdateWordsBoxRequestDto } from "./dto";
import { CurrentUser } from "@src/common/decorator/current-user.decorator";
import { ApiProperty, ApiBearerAuth, ApiTags, ApiOperation } from "@nestjs/swagger";
import { JwtAuthGuard } from "@src/common/guard/jwt-guard";
import { AddWordToBox } from "./commands/impl/add-word-to-box.command";
import { CreateWordsBoxCommand, DeleteWordsBoxCommand, RemoveWordsCommand, UpdateWordsBoxCommand } from "./commands/impl";
import { GetWordsBoxQuery, getWordsBoxDetailQuery } from "./queries/impl";
import { ROUTES } from "@src/common/routes/routes";

@ApiTags(ROUTES.WORDS_BOX.ROOT)
@Controller(ROUTES.WORDS_BOX.ROOT)
export class WordsBoxController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) { }

    @Post(ROUTES.WORDS_BOX.CREATE_WORDS_BOX.URL)
    @ApiOperation({
        description:ROUTES.WORDS_BOX.CREATE_WORDS_BOX.DESCRIPTION
    })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    createWordsBox(
        @Body() createWordRequestDto: CreateWordsBoxRequestDto,
        @CurrentUser() userId: string
    ) {
        return this.commandBus.execute(new CreateWordsBoxCommand(userId, createWordRequestDto));
    }

    @Put(ROUTES.WORDS_BOX.UPDATE_ADD_WORDS_TO_BOX.URL)
    @ApiOperation({
        description:ROUTES.WORDS_BOX.UPDATE_ADD_WORDS_TO_BOX.DESCRIPTION
    })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    addWordToBox(
        @Body() addWordToBoxRequestDto: AddWordToBoxRequestDto,
        @Param(ROUTES.WORDS_BOX.UPDATE_ADD_WORDS_TO_BOX.PARAM, new ParseUUIDPipe({ version: '4' })) boxId: string,
        @CurrentUser() userId: string,
    ) {
        return this.commandBus.execute(new AddWordToBox(userId, boxId, addWordToBoxRequestDto));
    }

    @Delete(ROUTES.WORDS_BOX.DELETE_WORDS_BOX.URL)
    @ApiOperation({
        description:ROUTES.WORDS_BOX.DELETE_WORDS_BOX.DESCRIPTION
    })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async deleteWordsBox(
        @Param(ROUTES.WORDS_BOX.DELETE_WORDS_BOX.PARAM, new ParseUUIDPipe({ version: '4' })) boxId: string,
        @Body() removeWordsRequestDto: RemoveWordsRequestDto,
        @CurrentUser() userId: string,
    ) {
        return await this.commandBus.execute(new DeleteWordsBoxCommand(userId, boxId, removeWordsRequestDto));
    }

    @Put(ROUTES.WORDS_BOX.UPDATE_WORDS_BOX.URL)
    @ApiOperation({
        description:ROUTES.WORDS_BOX.UPDATE_WORDS_BOX.DESCRIPTION
    })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async updateWordsBox(
        @Param(ROUTES.WORDS_BOX.UPDATE_WORDS_BOX.PARAM, new ParseUUIDPipe({ version: '4' })) boxId: string,
        @CurrentUser() userId: string,
        @Body() updateWordsBoxRequestDto: UpdateWordsBoxRequestDto
    ) {
        return await this.commandBus.execute(new UpdateWordsBoxCommand(userId, boxId, updateWordsBoxRequestDto));
    }

    @Put(ROUTES.WORDS_BOX.REMOVE_WORD_FROM_WORDS_BOX.URL)
    @ApiOperation({
        description:ROUTES.WORDS_BOX.REMOVE_WORD_FROM_WORDS_BOX.DESCRIPTION
    })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async removeWordsBox(
        @Param(ROUTES.WORDS_BOX.REMOVE_WORD_FROM_WORDS_BOX.PARAM, new ParseUUIDPipe({ version: '4' })) boxId: string,
        @Body() removeWordsRequestDto: RemoveWordsRequestDto,
        @CurrentUser() userId: string,
    ) {
        return await this.commandBus.execute(new RemoveWordsCommand(userId, boxId, removeWordsRequestDto));
    }
    
    @Get(ROUTES.WORDS_BOX.GET_ALL_WORDS_BOX.URL)
    @ApiOperation({
        description:ROUTES.WORDS_BOX.GET_ALL_WORDS_BOX.DESCRIPTION
    })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async getWordsBox(
        @CurrentUser() userId: string,
        @Query() getWordsRequestDto: GetWordsRequestDto
    ) {
        return await this.queryBus.execute(new GetWordsBoxQuery(userId, getWordsRequestDto));
    }

    @Get(ROUTES.WORDS_BOX.GET_WORDS_BOX.URL)
    @ApiOperation({
        description:ROUTES.WORDS_BOX.GET_WORDS_BOX.DESCRIPTION
    })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async getWordsBoxDetail(
        @CurrentUser() userId: string,
        @Param(ROUTES.WORDS_BOX.GET_WORDS_BOX.PARAM, new ParseUUIDPipe({ version: '4' })) boxId: string
        ) {
        return await this.queryBus.execute(new getWordsBoxDetailQuery(userId, boxId));
    }
}