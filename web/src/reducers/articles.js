// action types
const INIT_ARTICLES = 'INIT_ARTICLES';
const ADD_ARTICLE = 'ADD_ARTICLE';
const DELETE_ARTICLE = 'DELETE_ARTICLE';

export default function(state, action) {
    if(!state) {
        // 初始化
        state = { 
            articles: [],
        }; 
    }

    switch (action.type) {
        case INIT_ARTICLES:
            return { 
                ...state,
                articles: action.articles,
            };

        case ADD_ARTICLE:
            console.log(state.articles);
        
            return { 
                articles: [action.article, ...state.articles],
            };
        
        case DELETE_ARTICLE:
            return {
                articles: [
                    ...state.articles.slice(0, action.articleIndex),
                    ...state.articles.slice(action.articleIndex + 1)
                ]
            };

        default: 
            return state;
    }
}

export const initArticles = (articles) => {
    return { type: INIT_ARTICLES, articles }
}

export const addArticle = (article) => {
    return { type: ADD_ARTICLE, article }
}

export const deleteArticle = (articleIndex) => {
    return { type: DELETE_ARTICLE, articleIndex }
}


