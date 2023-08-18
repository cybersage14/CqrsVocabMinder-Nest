import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";

export class RemoveWordsBoxFromBoxRequestDto {
    @IsArray()
    @ApiProperty({isArray: true })
    wordsBoxIds: string []
}