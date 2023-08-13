const roots ={
    word:'/word',
    wordsBox:'/wordsBox',
    box:'/box',
};

export const ROUTES = {
    WORD:{
       ROOT: roots.word,
       CREATE_WORD:{
        URL:'',
        DESCRIPTION:'create word',
       },
       GET_WORDS:{
        URL:'',
        DESCRIPTION:'get all word',
       },
       GET_WORD_BY_ID:{
        URL:'/:wordId',
        DESCRIPTION:'get word by id',
        PARAM:'wordId'
       },
       UPDATE_WORD_BY_ID:{
        URL:'/:wordId',
        DESCRIPTION:'update word by id',
        PARAM:'wordId'
       },
       DELETE_WORD_BY_ID:{
        URL:'/:wordId',
        DESCRIPTION:'delete word by id',
        PARAM:'wordId'
       }
    }
} 