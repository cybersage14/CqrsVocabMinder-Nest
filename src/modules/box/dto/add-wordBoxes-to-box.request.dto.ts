import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";

export class AddWordsBoxesToBoxRequestDto {
    @IsArray()
    @ApiProperty({ isArray: true })
    WordBoxIds: string[]
}