import { SIGN_OUT, SESSION_STATE } from './actionTypes'
import ls from '../utils/ls'

const initialState = {
  isLoggedIn: false,
  isConnected: false
}

export const signOut = () => ({
  type: SIGN_OUT
})

const sessionReducers = {
  [SESSION_STATE]: (state, payload) => ({
    ...state,
    ...payload
  }),
  [SIGN_OUT]: state => {
    ls.remove('token')
    return {
      ...state,
      isLoggedIn: false,
      name: '',
      email: ''
    }
  }
}

export const sessionRootReducer = (state = initialState, action) => {
  let reducer = sessionReducers[action.type]
  return reducer ? reducer(state, action.payload) : state
}
