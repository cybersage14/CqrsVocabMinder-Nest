import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "@src/common/guard/jwt-guard";
import { CreateBoxCommand, DeleteBoxCommand, RemoveWordsBoxFromBoxCommand } from "./commands/impl";
import { AddWordsBoxesToBoxRequestDto, CreateBoxRequestDto, GetBoxesRequestDto, RemoveWordsBoxFromBoxRequestDto } from "./dto";
import { CurrentUser } from "@src/common/decorator/current-user.decorator";
import { AddWordsBoxesToBoxCommand } from "./commands/impl/add-wordsBoxes-to-box.command";
import { GetBoxesCommand } from "./queries/impl";
import { getBoxDetailCommand } from "./queries/impl/get-box-detail.command";

@ApiTags('box')
@Controller("box")
export class BoxController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) { }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({})
    @Post()
    async createBox(
        @CurrentUser() userId: string,
        @Body() createBoxRequestDto: CreateBoxRequestDto
    ) {
        return await this.commandBus.execute(new CreateBoxCommand(userId, createBoxRequestDto));
    }

    @Put("/add-wordsBox-to-box/:boxId")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({})
    async addWordsBoxesToBox(
        @Body() addWordsBoxesToBoxRequestDto: AddWordsBoxesToBoxRequestDto,
        @Param('boxId', new ParseUUIDPipe({ version: '4' })) boxId: string,
        @CurrentUser() userId :string
    ) {
        return await this.commandBus.execute(new AddWordsBoxesToBoxCommand(boxId,userId,addWordsBoxesToBoxRequestDto));
    }

    @Delete("/:boxId")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({})
    async deleteBox(
        @Param('boxId', new ParseUUIDPipe({ version: '4' })) boxId: string,
        @CurrentUser() userId :string
    ) {
        return await this.commandBus.execute(new DeleteBoxCommand(userId,boxId));
    }

    @Put("/remove-wordsBox-from-box/:boxId")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({})
    async removeWordsBoxFromBox(
        @Param('boxId', new ParseUUIDPipe({ version: '4' })) boxId: string,
        @CurrentUser() userId :string,
        @Body() removeWordsBoxFromBoxRequestDto: RemoveWordsBoxFromBoxRequestDto
    ) {
        return await this.commandBus.execute(new RemoveWordsBoxFromBoxCommand(boxId,userId,removeWordsBoxFromBoxRequestDto));
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({})
    @Get()
    async getBoxes(
        @CurrentUser() userId: string,
        @Query() getBoxesRequestDto: GetBoxesRequestDto
    ) {
        return await this.queryBus.execute(new GetBoxesCommand(userId, getBoxesRequestDto))
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({})
    @Get('/:boxId')
    async getBoxDetail(
        @CurrentUser() userId: string,
        @Param("boxId", new ParseUUIDPipe({ version: '4' })) boxId: string,
    ) {
        return await this.queryBus.execute(new getBoxDetailCommand(userId,boxId ))
    }
}