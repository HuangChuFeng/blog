/* reducer 就是用来描述数据的形态和相应的变更
 * 1. 定义action types
 * 2. 编写reducer
 * 3. 编写与这个reducer相关的action creators
 */

// action types
const INIT_IMGS = 'INIT_IMGS';
const ADD_IMG = 'ADD_IMG';
const DELETE_IMG = 'DELETE_IMG';
const ADD_IMG_FAVOR_COUNT = 'ADD_IMG_FAVOR';

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
            if(action.pageNum > 1) {
                return { 
                    ...state,
                    imgs: [ ...state.imgs, ...action.imgs],
                };
            } else {
                return { 
                    ...state,
                    imgs: action.imgs,
                };
            }

        case ADD_IMG:
            return { 
                ...state,
                imgs: [action.img, ...state.imgs],
            };
        case DELETE_IMG:
            return {
                ...state,
                imgs: [
                    ...state.imgs.slice(0, action.imgIndex),
                    ...state.imgs.slice(action.imgIndex + 1)
                ]
            };
        case ADD_IMG_FAVOR_COUNT:
            let imgs = [];
            state.imgs.forEach((item, index) => {
                imgs.push(item)
                if(index === action.index) {
                    let count = action.likeType === 0 ? (item.likes || 0) - 1 : (item.likes || 0) + 1
                    imgs[index].likes = count;
                }
            })
            return {
                ...state,
                imgs
            }

        default: 
            return state;
    }
}

export const initImgs = (imgs, pageNum) => {
    return { type: INIT_IMGS, imgs, pageNum }
}

export const addImg = (img) => {
    return { type: ADD_IMG, img }
}

export const deleteImg = (imgIndex) => {
    return { type: DELETE_IMG, imgIndex }
}

export const addImgFavorCount = (index, likeType) => {
    return { type: ADD_IMG_FAVOR_COUNT, index, likeType }
}


