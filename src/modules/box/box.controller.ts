import { Body, Controller, Param, ParseUUIDPipe, Post, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiProperty, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "@src/common/guard/jwt-guard";
import { CreateBoxCommand } from "./commands/impl";
import { AddWordsBoxesToBoxRequestDto, CreateBoxRequestDto } from "./dto";
import { CurrentUser } from "@src/common/decorator/current-user.decorator";
import { AddWordsBoxesToBoxCommand } from "./commands/impl/add-wordsBoxes-to-box.command";

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
}