import { ApiPropertyOptional, IntersectionType } from "@nestjs/swagger";
import { SortAndFiltersRequestDto } from "@src/common/dtos";
import { PaginateRequestDto } from "@src/common/dtos/paginate.request.dto";

export enum GetWordsBoxRequestDtoEnum {
    wordsBoxCreatedAt = 'wordsBox.createdAt'
}

export class GetWordsRequestDto extends IntersectionType(
    PaginateRequestDto, 
    SortAndFiltersRequestDto
) {
    @ApiPropertyOptional({enum: GetWordsBoxRequestDtoEnum})
    sort?: GetWordsBoxRequestDtoEnum
}