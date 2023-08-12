import { Body, Controller, Delete, Param, ParseUUIDPipe, Post, Put, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { AddWordToBoxRequestDto, CreateWordsBoxRequestDto, RemoveWordsRequestDto, UpdateWordsBoxRequestDto } from "./dto";
import { CurrentUser } from "@src/common/decorator/current-user.decorator";
import { ApiProperty, ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "@src/common/guard/jwt-guard";
import { AddWordToBox } from "./commands/impl/add-word-to-box.command";
import { CreateWordsBoxCommand, DeleteWordsBoxCommand, RemoveWordsCommand, UpdateWordsBoxCommand } from "./commands/impl";

@ApiTags('words-box')
@Controller('/words-box')
export class WordsBoxController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) { }

    @ApiProperty({})
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post()
    createWordsBox(
        @Body() createWordRequestDto: CreateWordsBoxRequestDto,
        @CurrentUser() userId: string
    ) {
        return this.commandBus.execute(new CreateWordsBoxCommand(userId, createWordRequestDto));
    }

    @ApiProperty({})
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post('/add-word-to-box/:boxId')
    addWordToBox(
        @Body() addWordToBoxRequestDto: AddWordToBoxRequestDto,
        @Param('boxId', new ParseUUIDPipe({ version: '4' })) boxId: string,
        @CurrentUser() userId: string,
    ) {
        return this.commandBus.execute(new AddWordToBox(userId, boxId, addWordToBoxRequestDto));
    }

    @ApiProperty({})
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete('/:boxId')
    async deleteWordsBox(
        @Param('boxId', new ParseUUIDPipe({ version: '4' })) boxId: string,
        @Body() removeWordsRequestDto: RemoveWordsRequestDto,
        @CurrentUser() userId: string,
    ) {
        return await this.commandBus.execute(new RemoveWordsCommand(userId, boxId, removeWordsRequestDto));
    }


    @ApiProperty({})
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Put('/:boxId')
    async updateWordsBox(
        @Param('boxId', new ParseUUIDPipe({ version: '4' })) boxId: string,
        @CurrentUser() userId: string,
        @Body() updateWordsBoxRequestDto:UpdateWordsBoxRequestDto
    ) {
        return await this.commandBus.execute(new UpdateWordsBoxCommand(userId, boxId, updateWordsBoxRequestDto));
    }
}