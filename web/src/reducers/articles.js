// action types
const INIT_ARTICLES = 'INIT_ARTICLES';
const ADD_ARTICLE = 'ADD_ARTICLE';
const DELETE_ARTICLE = 'DELETE_ARTICLE';
const GET_ARTICLE_BY_ID = 'GET_ARTICLE_BY_ID';
const UPDATE_ARTICLE = 'UPDATE_ARTICLE';

export default function(state, action) {
    if(!state) {
        // 初始化
        state = { 
            articles: [],
            curArticle: null,       // 当前查看或编辑的文章
        }; 
    }

    switch (action.type) {
        case INIT_ARTICLES:
            return { 
                articles: action.articles,
            };

        case ADD_ARTICLE:
            return { 
                ...state,
                articles: [action.article, ...state.articles],
            };
        
        case DELETE_ARTICLE:
            return {
                ...state,
                articles: [
                    ...state.articles.slice(0, action.articleIndex),
                    ...state.articles.slice(action.articleIndex + 1)
                ]
            };
        
        case GET_ARTICLE_BY_ID:
            let cur = null;
            state.articles.forEach((item, i) => {
                if(item._id === action.articleId) {
                    cur = item;
                    cur.index = i;
                    return false;
                }
            });
            return { 
                ...state,
                curArticle: cur 
            };
        
        case UPDATE_ARTICLE:
            state.articles.forEach(item => {
                if(item._id === action.article._id) {
                    item = Object.assign(item, action.article);
                    return false;
                }
            });
            return {
                ...state

            }

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

export const getArticleById = (articleId) => {
    return { type: GET_ARTICLE_BY_ID, articleId }
}

export const updateArticle = (article) => {
    return { type: UPDATE_ARTICLE, article }
}

