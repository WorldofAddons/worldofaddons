import { combineReducers } from 'redux'
import { addons } from './addons.reducer'
import { ipc } from './ipc.reducer'

export default combineReducers({
  addons,
  ipc
})
