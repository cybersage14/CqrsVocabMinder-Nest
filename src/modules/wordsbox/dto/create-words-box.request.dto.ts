import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateWordsBoxRequestDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string
}