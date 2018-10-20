import { combineReducers } from 'redux'

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
    default:
      return state
  }
}


const initialStateDict = {}
const dict = (state = initialStateDict, action) => {
  let newState = state // TODO: fix with deep clone
  switch (action.type) {
    case 'addonList':
      return action.data
    case 'modAddonObj':
      newState[action.data.name] = action.data
      return newState
    case 'updateAddonStatus':
      newState[action.data.name].dlStatus = action.data.dlStatus // TODO: name isnt being sent back?
      return newState
    default:
      return state
  }
}

export const addons = combineReducers({
  nameList,
  dict
})
