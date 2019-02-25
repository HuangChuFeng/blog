// action types
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
        case ADD_ARTICLE:
            return { 
                articles: [action.articles, ...state.articles],
            };
        
        case DELETE_ARTICLE:
            return {
                imgs: [
                    ...state.articles.slice(0, action.articleIndex),
                    ...state.articles.slice(action.articleIndex + 1)
                ]
            };

        default: 
            return state;
    }
}

export const addArticle = (img) => {
    return { type: ADD_IMG, img }
}

export const deleteArticle = (imgIndex) => {
    return { type: DELETE_IMG, imgIndex }
}


