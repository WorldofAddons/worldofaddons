import { combineReducers } from 'redux'


const initialStateNameList = []
const nameList = (state = initialStateNameList, action) => {
  switch (action.type) {
    case 'addonList':
      return Array.from(action.data).map(addon => addon.name)
    case 'newAddonObj':
      const newState = [...state]
      newState.push(action.name)
      return newState
    default:
      return state
  }
}

const initialStateDict = {}
const dict = (state = initialStateDict, action) => {
  let newState = {state} // TODO: fix with deep clone
  switch (action.type) {
    case 'addonList':
      return action.data
    case 'newAddonObj':
      newState[action.data.name] = action.data
      return newState
    case 'updateAddonStatus':
      newState[action.data.name] = action.data
      return newState
    default:
      return state
  }
}

export const addons = combineReducers({
  nameList,
  dict
})
