const roots = {
    word: '/word',
    wordsBox: '/wordsBox',
    box: '/box',
};

export const ROUTES = {
    WORD: {
        ROOT: roots.word,
        CREATE_WORD: {
            URL: '',
            DESCRIPTION: 'create word',
        },
        GET_WORDS: {
            URL: '',
            DESCRIPTION: 'get all word',
        },
        GET_WORD_BY_ID: {
            URL: '/:wordId',
            DESCRIPTION: 'get word by id',
            PARAM: 'wordId'
        },
        UPDATE_WORD_BY_ID: {
            URL: '/:wordId',
            DESCRIPTION: 'update word by id',
            PARAM: 'wordId'
        },
        DELETE_WORD_BY_ID: {
            URL: '/:wordId',
            DESCRIPTION: 'delete word by id',
            PARAM: 'wordId'
        }
    },
    WORDS_BOX: {
        ROOT: roots.wordsBox,
        CREATE_WORDS_BOX:{
            URL:'',
            DESCRIPTION:'create words box'
        },
        ADD_WORDS_TO_BOX:{
            URL:'/add-word-to-box/:boxId',
            PARAM:'boxId',
            DESCRIPTION:'add words to box '
        },
        DELETE_WORDS_BOX:{
            URL:'/:boxId',
            PARAM:'boxId',
            DESCRIPTION:'delete words box by id'
        },
        UPDATE_WORDS_BOX:{
            URL:'/:boxId',
            PARAM:'boxId',
            DESCRIPTION:'update words box by id'
        },
        GET_ALL_WORDS_BOX:{
            URL:'',
            DESCRIPTION:'get all words box'
        },
        GET_WORDS_BOX:{
            URL:"/:boxId",
            PARAM:'boxId',
            DESCRIPTION:'get words box by id'
        }
    },
    BOX: {
        ROOT: roots.box,
    }
} 