const CHANGE_CUR_NAV = 'CHANGE_CUR_NAV'
const CHANGE_LOGIN_STATUS = 'CHANGE_LOGIN_STATUS'

export default function(state, action) {
    if(!state) {
        // 初始化
        state = { 
            curNav: '',             // 当前header选中标签
            isLogined: Boolean(window.localStorage.getItem('user'))         // 是否登录
        }; 
    }

    switch (action.type) {
        case CHANGE_CUR_NAV: 
            return {
                ...state,
                curNav: action.nav
            }
        
        case CHANGE_LOGIN_STATUS:
            console.log('isLogined', action.isLogined);
            
            return {
                ...state,
                isLogined: action.isLogined
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



