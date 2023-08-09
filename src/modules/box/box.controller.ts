import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiProperty, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "@src/common/guard/jwt-guard";
import { CreateBoxCommand } from "./commands/impl";
import { AddWordsBoxesToBoxRequestDto, CreateBoxRequestDto, GetBoxesRequestDto } from "./dto";
import { CurrentUser } from "@src/common/decorator/current-user.decorator";
import { AddWordsBoxesToBoxCommand } from "./commands/impl/add-wordsBoxes-to-box.command";
import { GetBoxesCommand } from "./queries/impl";
import { getBoxCommand } from "./queries/impl/get-box.command";

@ApiTags('box')
@Controller("box")
export class BoxController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) { }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiProperty({})
    @Post()
    async createBox(
        @CurrentUser() userId: string,
        @Body() createBoxRequestDto: CreateBoxRequestDto
    ) {
        return await this.commandBus.execute(new CreateBoxCommand(userId, createBoxRequestDto));
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiProperty({})
    @Post("/:boxId")
    async addWordsBoxesToBox(
        @Body() addWordsBoxesToBoxRequestDto: AddWordsBoxesToBoxRequestDto,
        @Param('boxId', new ParseUUIDPipe({ version: '4' })) boxId: string
    ) {
        return await this.commandBus.execute(new AddWordsBoxesToBoxCommand(boxId, addWordsBoxesToBoxRequestDto));
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiProperty({})
    @Get()
    async getBoxes(
        @CurrentUser() userId: string,
        @Query() getBoxesRequestDto: GetBoxesRequestDto
    ) {
        return await this.queryBus.execute(new GetBoxesCommand(userId, getBoxesRequestDto))
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiProperty({})
    @Get('/:boxId')
    async getBox(
        @CurrentUser() userId: string,
        @Param("boxId", new ParseUUIDPipe({ version: '4' })) boxId: string,
    ) {
        return await this.queryBus.execute(new getBoxCommand(userId,boxId ))
    }
}