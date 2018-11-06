import { ipcRenderer } from 'electron'

// Supposed to send data out to background process
const initialState = {}
export const ipc = (state = initialState, action) => {
  switch (action.type) {
    case 'IPC_SEND':
      const { channel, payload } = action
      ipcRenderer.send(channel, payload)
    default:
      return state
  }
}
