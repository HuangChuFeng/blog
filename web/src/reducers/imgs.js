/* reducer 就是用来描述数据的形态和相应的变更
 * 1. 定义action types
 * 2. 编写reducer
 * 3. 编写与这个reducer相关的action creators
 */

// action types
const INIT_IMGS = 'INIT_IMGS';
const ADD_IMG = 'ADD_IMG';
const DELETE_IMG = 'DELETE_IMG';
const GET_IMG_BY_ID = 'GET_IMG_BY_ID';

export default function(state, action) {
    if(!state) {
        // 初始化
        state = { 
            imgs: [],
            curImg: {}
        }; 
    }

    switch (action.type) {
        case INIT_IMGS:
            // 初始化图片列表
            console.log('init')
            return { 
                imgs: action.imgs,
            };

        case ADD_IMG:
            return { 
                imgs: [...state.imgs, action.imgs],
            };

        case GET_IMG_BY_ID:
            let img = state.imgs.filter((item) => {
                return item.id == action.id
            })[0];
            console.log('get img by id', img);
            return { 
                ...state, 
                curImg: img,
            };
        
        case DELETE_IMG:
            return {
                imgs: [
                    ...state.imgs.slice(0, action.imgsIndex),
                    ...state.imgs.slice(action.imgsIndex + 1)
                ]
            };

        default: 
            return state;
    }
}

export const initImgs = (imgs) => {
    return { type: INIT_IMGS, imgs }
}

export const getImgById = (id) => {
    return { type: GET_IMG_BY_ID, id }
}

export const addImg = (img) => {
    return { type: ADD_IMG, img }
}

export const deleteImg = (imgIndex) => {
    return { type: DELETE_IMG, imgIndex }
}


