import { ApiPropertyOptional, IntersectionType } from "@nestjs/swagger";
import { SortAndFiltersRequestDto } from "@src/common/dtos";
import { PaginateRequestDto } from "@src/common/dtos/paginate.request.dto";

export enum GetBoxesRequestDtoEnum {
    boxCreatedAt = 'box.createdAt',
}

export class GetBoxesRequestDto extends IntersectionType(
    PaginateRequestDto,
    SortAndFiltersRequestDto
) {
    @ApiPropertyOptional({ enum: GetBoxesRequestDtoEnum })
    sort?: GetBoxesRequestDtoEnum
}