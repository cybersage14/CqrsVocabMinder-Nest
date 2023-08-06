import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiProperty, ApiTags } from "@nestjs/swagger";
import { CreateWordRequestDto } from "./dto/create-word.request.dto";
import { CreateWordCommand } from "./commands/impl";
import { CurrentUser } from "../../common/decorator/current-user.decorator";
import { JwtAuthGuard } from "./../../common/guard/jwt-guard";

@Controller('/word')
@ApiTags('word')
export class WordController {
    constructor(
        private readonly commandBus: CommandBus,
    ){}

    @ApiProperty({})
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post()
    async createWord(
        @CurrentUser() userId:string,
        @Body() createWordRequestDto: CreateWordRequestDto
    ){
        console.log(userId);
        
       return await this.commandBus.execute(new CreateWordCommand(userId,createWordRequestDto));
    }
}