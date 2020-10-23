import { createStore, combineReducers } from 'redux'
import { lobyReducer } from './reducer'

const store = createStore(
    combineReducers({
        loby: lobyReducer
    })
)

export default store