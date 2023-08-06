import { IntersectionType } from "@nestjs/swagger";
import { SortRequestDto } from "./sort.request.dto";
import { FilterRequestDto } from "./filter.request.dto";

export class SortAndFiltersRequestDto extends IntersectionType(SortRequestDto, FilterRequestDto) {}