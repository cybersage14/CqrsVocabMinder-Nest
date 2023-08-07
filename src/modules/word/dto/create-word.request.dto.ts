import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class CreateWordRequestDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    word: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    definition: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    usage: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    pronounce: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    example: string;
}