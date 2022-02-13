import { combineReducers, createStore, applyMiddleware } from 'redux'

// devtools extentions
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'

// reducers
import userReducer from './userDuck'
import gameReducer from './gameDuck'

const reducer = combineReducers({ user: userReducer, game: gameReducer })

export default function useStore() {
  return createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))
}
