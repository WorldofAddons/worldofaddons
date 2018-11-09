export const getAddonList = (state) => {
  const { nameList, dict } = state.addons
  return Array.from(nameList).map(name => dict[name])
}

export const getAddonNames = (state) => {
  return state.nameList
}

export const getSettings = (state) => {
  return state.addons.settings
}
