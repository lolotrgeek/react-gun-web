import Gun from 'gun/gun'

const port = '8765'
const address = 'localhost'
const peers = [`http://${address}:${port}/gun`]

export const gun = new Gun({
  peers: peers,
})