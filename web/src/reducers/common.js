const CHANGE_CUR_NAV = 'CHANGE_CUR_NAV'
const CHANGE_LOGIN_STATUS = 'CHANGE_LOGIN_STATUS'
const CHANGE_USER_TYPE = 'CHANGE_USER_TYPE'

export default function(state, action) {
    if(!state) {
        // 初始化
        state = { 
            curNav: '',             // 当前header选中标签
            isLogined: Boolean(window.localStorage.getItem('user')),         // 是否登录
            isAdmin: window.localStorage.getItem('type') === '1',    // 是否是管理员 
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




