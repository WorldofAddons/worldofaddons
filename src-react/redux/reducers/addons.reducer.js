import { combineReducers } from 'redux'
import clonedeep from 'lodash.clonedeep'

const initialStateNameList = []
const nameList = (state = initialStateNameList, action) => {
  let newState
  switch (action.type) {
    case 'addonList':
      return Object.keys(action.data).map(key => action.data[key].name)
    case 'modAddonObj':
      newState = [...state]
      if (newState.findIndex(a => a === action.data.name) === -1) {
        newState.push(action.data.name)
      }
      return newState
    case 'delAddonObj':
      newState = [...state]
      const idx = newState.indexOf(action.data.name)
      if (idx !== -1) {
        newState.splice(idx, 1)
      }
      return newState
    default:
      return state
  }
}


const initialStateDict = {}
const dict = (state = initialStateDict, action) => {
  let newState = clonedeep(state)

  switch (action.type) {
    case 'addonList':
      return action.data
    case 'modAddonObj':
      newState[action.data.name] = action.data
      return newState
    case 'updateAddonDL':
      const {dlStatus, name} = action.data
      newState[name].dlStatus = dlStatus // TODO: name isnt being sent back?
      return newState
    case 'delAddonObj':
      delete newState[name]
      return newState
    default:
      return state
  }
}

export const addons = combineReducers({
  nameList,
  dict
})
