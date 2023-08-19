import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateBoxRequestDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name :string    
}