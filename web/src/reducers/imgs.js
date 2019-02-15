/* reducer 就是用来描述数据的形态和相应的变更
 * 1. 定义action types
 * 2. 编写reducer
 * 3. 编写与这个reducer相关的action creators
 */

// action types
const INIT_IMGS = 'INIT_IMGS';
const ADD_IMG = 'ADD_IMG';
const DELETE_IMG = 'DELETE_IMG';

// 使用三个常量来存储 action.type 的类型， 方便以后修改
export default function(state, action) {
    if(!state) {
        state = { imgs: [] }; // 初始化
    }

    switch (action.type) {
        case INIT_IMGS:
            // 初始化图片列表
            return { imgs: action.imgs };

        case ADD_IMG:
            return { imgs: [...state.imgs, action.imgs] };
        
        case DELETE_IMG:
            return {
                imgs: [
                    ...state.imgs.slice(0, action.imgsIndex),
                    ...state.imgs.slice(action.imgsIndex+1)
                ]
            };

        default: 
            return state;
    }
}

export const initImgs = (imgs) => {
    return { type: INIT_IMGS, imgs }
}

export const addImg = (img) => {
    return { type: ADD_IMG, img }
}

export const deleteImg = (imgIndex) => {
    return { type: DELETE_IMG, imgIndex }
}



