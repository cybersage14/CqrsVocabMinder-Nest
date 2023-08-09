import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateBoxRequestDto {
    @IsString()
    @ApiProperty()
    @IsNotEmpty()
    name: string
} 