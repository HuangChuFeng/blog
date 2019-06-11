const CHANGE_CUR_NAV = 'CHANGE_CUR_NAV'
const CHANGE_LOGIN_STATUS = 'CHANGE_LOGIN_STATUS'
const CHANGE_USER_TYPE = 'CHANGE_USER_TYPE'
const CHANGE_SHOW_MUSIC = 'CHANGE_SHOW_MUSIC'
const SET_LIKES = 'SET_LIKES'

export default function(state, action) {
    if(!state) {
        // 初始化
        state = { 
            likes: [],  // 用户likes
            changeMusic: window.location.pathname === '/about',       // 是否显示音乐模块
            curNav: '',             // 当前header选中标签
            isLogined: Boolean(window.sessionStorage.getItem('user')),         // 是否登录
            isAdmin: window.sessionStorage.getItem('type') === '1',    // 是否是管理员 
        }; 
    }

    switch (action.type) {
        case CHANGE_CUR_NAV: 
            return {
                ...state,
                curNav: action.nav
            }
        
        case CHANGE_LOGIN_STATUS:
            return {
                ...state,
                isLogined: action.isLogined
            }
        
        case CHANGE_USER_TYPE:
            console.log('isAdmin', action.isAdmin);
            return {
                ...state,
                isAdmin: action.isAdmin
            }
        
        case CHANGE_SHOW_MUSIC: 
            return {
                ...state,
                changeMusic: action.changeMusic
            }
            
        case SET_LIKES: 
            return {
                ...state,
                likes: action.likes
            }

        default: 
            return state;
    }
}
export const changeCurNav = (nav) => {
    return { type: CHANGE_CUR_NAV, nav }
}

export const changeLoginStatus = (isLogined) => {
    return { type: CHANGE_LOGIN_STATUS, isLogined }
}

export const changeUserType = (isAdmin) => {
    return { type: CHANGE_USER_TYPE, isAdmin }
}

export const changeShowMusic = (changeMusic) => {
    return { type: CHANGE_SHOW_MUSIC, changeMusic }
}

export const setLikes = (likes) => {
    return { type: SET_LIKES, likes }
}



