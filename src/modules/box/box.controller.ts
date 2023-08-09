import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiProperty, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "@src/common/guard/jwt-guard";
import { CreateBoxCommand } from "./commands/impl";
import { CreateBoxRequestDto } from "./dto";
import { CurrentUser } from "@src/common/decorator/current-user.decorator";

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
}