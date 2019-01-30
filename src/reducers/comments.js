/* reducer 就是用来描述数据的形态和相应的变更
 * 1. 定义action types
 * 2. 编写reducer
 * 3. 编写与这个reducer相关的action creators
 */

// action types
const INIT_COMMENTS = 'INIT_COMMENTS';
const ADD_COMMENT = 'ADD_COMMENT';
const DELETE_COMMENT = 'DELETE_COMMENT';

// 使用三个常量来存储 action.type 的类型， 方便以后修改
export default function(state, action) {
    if(!state) {
        state = { comments: [] }; // 初始化
    }

    switch (action.type) {
        case INIT_COMMENTS:
            // 初始化评论
            return { comments: action.comments };

        case ADD_COMMENT:
            return { comments: [...state.comments, action.comment] };
        
        case DELETE_COMMENT:
            return {
                comments: [
                    ...state.comments.slice(0, action.commentIndex),
                    ...state.comments.slice(action.commentIndex+1)
                ]
            };

        default: 
            return state;
    }
}

export const initComments = (comments) => {
    return { type: INIT_COMMENTS, comments }
}

export const addComment = (comment) => {
    return { type: ADD_COMMENT, comment }
}

export const deleteComment = (commentIndex) => {
    return { type: DELETE_COMMENT, commentIndex }
}



