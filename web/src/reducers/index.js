import { combineReducers, Reducer } from 'redux'
import imgsReducer from './imgs'
import articlesReducer from './articles'

const reducer = combineReducers({
    imgsReducer,
    articlesReducer
})

export default reducer