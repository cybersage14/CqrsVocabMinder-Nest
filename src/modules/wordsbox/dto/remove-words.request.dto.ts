import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";

export class RemoveWordsRequestDto {
    @IsArray()
    @ApiProperty({isArray: true })
    wordsIds:string []
}