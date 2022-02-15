import { combineReducers, createStore, applyMiddleware } from 'redux'

// devtools extentions
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'

// reducers
import userReducer from './user'
import gameReducer from './game'

const reducer = combineReducers({ user: userReducer, game: gameReducer })

export default function useStore() {
  return createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))
}
