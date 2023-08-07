import { SelectQueryBuilder } from 'typeorm';

export const paginate = async <T>(
  queryBuilder: SelectQueryBuilder<T>,
  limit = 10,
  page = 1,
): Promise<{
  items: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}> => {
  const itemsAndCount = await queryBuilder
    .take(limit)
    .skip((page - 1) * limit)
    .getManyAndCount();

  const totalItems = itemsAndCount[1];

  const itemCount = itemsAndCount[0].length;
  const totalPages = Math.ceil(totalItems / limit);

  const meta = {
    totalItems,
    itemCount,
    itemsPerPage: Number(limit),
    totalPages,
    currentPage: Number(page),
  };

  return { items: itemsAndCount[0], meta };
};
