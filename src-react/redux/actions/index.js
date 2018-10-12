export const ipcSendAction = (channel, payload) => {
  return {
    type: 'IPC_SEND',
    channel,
    payload
  }
}