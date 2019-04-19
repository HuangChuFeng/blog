// action types
const INIT_ARTICLES = 'INIT_ARTICLES';
const ADD_ARTICLE = 'ADD_ARTICLE';
const DELETE_ARTICLE = 'DELETE_ARTICLE';
const SET_CUR_ARTICLE = 'SET_CUR_ARTICLE';
const UPDATE_ARTICLE = 'UPDATE_ARTICLE';

const INIT_TAGS = 'INIT_TAGS';
const ADD_TAG = 'ADD_TAG';
const DELETE_TAG = 'DELETE_TAG';

export default function(state, action) {
    if(!state) {
        // 初始化
        state = { 
            articles: [],
            curArticle: null,       // 当前查看或编辑的文章
            tags: [],
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
        
        case SET_CUR_ARTICLE:
            let cur = action.article;
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

        case INIT_TAGS:
            return { 
                tags: action.tags,
            };

        case ADD_TAG:
            return { 
                ...state,
                tags: [action.tag, ...state.tags],
            };
        
        case DELETE_TAG:
            return {
                ...state,
                tags: [
                    ...state.tags.slice(0, action.tagIndex),
                    ...state.tags.slice(action.tagIndex + 1)
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

export const setCurArticle = (article) => {
    return { type: SET_CUR_ARTICLE, article }
}

export const updateArticle = (article) => {
    return { type: UPDATE_ARTICLE, article }
}

export const initTags = (tags) => {
    return { type: INIT_TAGS, tags }
}

export const addTag = (tag) => {
    return { type: ADD_TAG, tag }
}

export const deleteTag = (tagIndex) => {
    return { type: DELETE_TAG, tagIndex }
}



