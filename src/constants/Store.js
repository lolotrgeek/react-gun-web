import Gun from 'gun'
const debug = true

debug && console.log('using localStorage...')

//TODO process to find signal server
const port = '8765'
const address = '192.168.1.109'
const peers = [`http://${address}:${port}/gun`]

export const gun = new Gun({
  peers: peers,
})