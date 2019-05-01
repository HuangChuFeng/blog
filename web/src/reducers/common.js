const CHANGE_CUR_NAV = 'CHANGE_CUR_NAV'

export default function(state, action) {
    if(!state) {
        // 初始化
        state = { 
            curNav: '',             // 当前header选中标签
        }; 
    }

    switch (action.type) {
        case CHANGE_CUR_NAV: 
            return {
                ...state,
                curNav: action.nav
            }
            
        default: 
            return state;
    }
}
export const changeCurNav = (nav) => {
    return { type: CHANGE_CUR_NAV, nav }
}



