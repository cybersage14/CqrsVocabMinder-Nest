import { ApiPropertyOptional, IntersectionType } from "@nestjs/swagger";
import { SortAndFiltersRequestDto } from "../../../common/dtos";
import { PaginateRequestDto } from "../../../common/dtos/paginate.request.dto";

export enum GetWordsRequestDtoEnum {
    wordCreatedAt = 'word.createdAt',
}

export class GetWordsRequestDto extends IntersectionType(
    PaginateRequestDto, 
    SortAndFiltersRequestDto
) {
    @ApiPropertyOptional({enum: GetWordsRequestDtoEnum})
    sort?: GetWordsRequestDtoEnum
}