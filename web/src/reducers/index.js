import { combineReducers, Reducer } from 'redux'
import imgsReducer from './imgs'
import articlesReducer from './articles'
import commonReducer from './common'

const reducer = combineReducers({
    imgsReducer,
    articlesReducer,
    commonReducer
})

export default reducer