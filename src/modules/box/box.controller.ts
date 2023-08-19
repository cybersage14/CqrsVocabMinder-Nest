import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "@src/common/guard/jwt-guard";
import { CreateBoxCommand, DeleteBoxCommand, RemoveWordsBoxFromBoxCommand, UpdateBoxCommand } from "./commands/impl";
import { AddWordsBoxesToBoxRequestDto, CreateBoxRequestDto, GetBoxesRequestDto, RemoveWordsBoxFromBoxRequestDto, UpdateBoxRequestDto } from "./dto";
import { CurrentUser } from "@src/common/decorator/current-user.decorator";
import { AddWordsBoxesToBoxCommand } from "./commands/impl/add-wordsBoxes-to-box.command";
import { GetBoxesCommand } from "./queries/impl";
import { getBoxDetailCommand } from "./queries/impl/get-box-detail.command";
import { ROUTES } from "@src/common/routes/routes";

@ApiTags(ROUTES.BOX.ROOT)
@Controller(ROUTES.BOX.ROOT)
export class BoxController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) { }

    @Post(ROUTES.BOX.CREATE_BOX.URL)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        description:ROUTES.BOX.CREATE_BOX.DESCRIPTION
    })
    async createBox(
        @CurrentUser() userId: string,
        @Body() createBoxRequestDto: CreateBoxRequestDto
    ) {
        return await this.commandBus.execute(new CreateBoxCommand(userId, createBoxRequestDto));
    }

    @Put(ROUTES.BOX.ADD_WORDS_BOX_TO_BOX.URL)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        description: ROUTES.BOX.ADD_WORDS_BOX_TO_BOX.DESCRIPTION
    })
    async addWordsBoxesToBox(
        @Body() addWordsBoxesToBoxRequestDto: AddWordsBoxesToBoxRequestDto,
        @Param(ROUTES.BOX.ADD_WORDS_BOX_TO_BOX.PARAM, new ParseUUIDPipe({ version: '4' })) boxId: string,
        @CurrentUser() userId :string
    ) {
        return await this.commandBus.execute(new AddWordsBoxesToBoxCommand(boxId,userId,addWordsBoxesToBoxRequestDto));
    }

    @Delete(ROUTES.BOX.DELETE_BOX.URL)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        description: ROUTES.BOX.DELETE_BOX.DESCRIPTION
    })
    async deleteBox(
        @Param(ROUTES.BOX.DELETE_BOX.PARAM, new ParseUUIDPipe({ version: '4' })) boxId: string,
        @CurrentUser() userId :string
    ) {
        return await this.commandBus.execute(new DeleteBoxCommand(userId,boxId));
    }

    @Put(ROUTES.BOX.REMOVE_WORDS_BOX_FROM_BOX.URL)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        description: ROUTES.BOX.REMOVE_WORDS_BOX_FROM_BOX.DESCRIPTION
    })
    async removeWordsBoxFromBox(
        @Param(ROUTES.BOX.REMOVE_WORDS_BOX_FROM_BOX.PARAM, new ParseUUIDPipe({ version: '4' })) boxId: string,
        @CurrentUser() userId :string,
        @Body() removeWordsBoxFromBoxRequestDto: RemoveWordsBoxFromBoxRequestDto
    ) {
        return await this.commandBus.execute(new RemoveWordsBoxFromBoxCommand(boxId,userId,removeWordsBoxFromBoxRequestDto));
    }

    @Put(ROUTES.BOX.UPDATE_BOX.URL)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        description: ROUTES.BOX.UPDATE_BOX.DESCRIPTION
    })
    async updateBox(
        @Param(ROUTES.BOX.ADD_WORDS_BOX_TO_BOX.PARAM, new ParseUUIDPipe({ version: '4' })) boxId: string,
        @CurrentUser() userId :string,
        @Body() updateBoxRequestDto: UpdateBoxRequestDto,
    ) {
        return await this.commandBus.execute(new UpdateBoxCommand(userId,boxId,updateBoxRequestDto));
    }

    @Get(ROUTES.BOX.GET_ALL_BOX.URL)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        description: ROUTES.BOX.GET_ALL_BOX.DESCRIPTION
    })
    async getBoxes(
        @CurrentUser() userId: string,
        @Query() getBoxesRequestDto: GetBoxesRequestDto
    ) {
        return await this.queryBus.execute(new GetBoxesCommand(userId, getBoxesRequestDto))
    }

    @Get(ROUTES.BOX.GET_BOX_DETAIL.URL)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        description: ROUTES.BOX.GET_BOX_DETAIL.DESCRIPTION
    })
    async getBoxDetail(
        @CurrentUser() userId: string,
        @Param(ROUTES.BOX.GET_BOX_DETAIL.PARAM, new ParseUUIDPipe({ version: '4' })) boxId: string,
    ) {
        return await this.queryBus.execute(new getBoxDetailCommand(userId,boxId ))
    }
}