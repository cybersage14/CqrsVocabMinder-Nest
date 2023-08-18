import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { getWordsBoxDetailQuery } from "../impl";
import { InjectRepository } from "@nestjs/typeorm";
import { WordsBoxEntity } from "@src/entities";
import { Repository } from "typeorm";
import { CustomError, WORDS_BOX_NOT_FOUND } from "@src/common/errors";

@QueryHandler(getWordsBoxDetailQuery)
export class WordsBoxDetailHandler implements IQueryHandler<getWordsBoxDetailQuery> {
    constructor(
        @InjectRepository(WordsBoxEntity) private readonly wordsBoxRepository: Repository<WordsBoxEntity>
    ) { }
    async execute(query: getWordsBoxDetailQuery): Promise<any> {
        const { boxId, userId } = query
        const queryBuilder = this.wordsBoxRepository.createQueryBuilder('wordsBox')
            .leftJoin('wordsBox.user', 'user').andWhere('user.id = :userId', { userId })
            .leftJoinAndSelect('wordsBox.words', 'words')
            .andWhere('wordsBox.id = :boxId', { boxId })

        if (!await queryBuilder.getOne())
            throw new CustomError(WORDS_BOX_NOT_FOUND)

        return await queryBuilder.getOne()
    }
}