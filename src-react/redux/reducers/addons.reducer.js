import { combineReducers } from 'redux'

const initialStateNameList = []
const nameList = (state = initialStateNameList, action) => {
  let newState
  switch (action.type) {
    case 'addonList':
      return Object.keys(action.data).map(key => action.data[key].name)
    case 'newAddonObj':
      newState = [...state]
      newState.push(action.data.name)
      return newState
    default:
      return state
  }
}

// TODO: this will be removed in the future.
const initDlStatus = (state) => {
  const newState = state
  const nameList = Object.keys(state).map(key => state[key].name)
  nameList.forEach(name => newState[name].dlStatus = 100)
  return newState
}

const initialStateDict = {}
const dict = (state = initialStateDict, action) => {
  let newState = state // TODO: fix with deep clone
  switch (action.type) {
    case 'addonList':
      newState = action.data
      return initDlStatus(newState)
    case 'newAddonObj':
      newState[action.data.name] = action.data
      newState[action.data.name].dlStatus = 0
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
