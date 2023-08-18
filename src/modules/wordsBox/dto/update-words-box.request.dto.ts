import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class UpdateWordsBoxRequestDto {
    @IsString()
    @IsOptional()
    @ApiProperty()
    name: string

    @IsBoolean()
    @IsOptional()
    @ApiProperty()
    is_learned: boolean
}