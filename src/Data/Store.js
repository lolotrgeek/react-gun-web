import Gun from 'gun/gun'
import EventEmitter from 'eventemitter3'

const debug = true

debug && console.log('using localStorage...')

//TODO process to find signal server
const port = '8765'
const address = '192.168.1.109'
const peers = [`http://${address}:${port}/gun`]

const gun = new Gun({
  peers: peers,
})

const app = gun.get('app')
const messenger = new EventEmitter()

/**
 * 
 * @param {*} input 
 */
export const parser = input => {
  try {
    input = JSON.parse(input)
  } catch (error) {
    debug && console.log('[Parse node] not a JSON object')
  } finally {
    return input
  }
}

export const inputParser = msg => {
  if (typeof msg === 'string') {
    debug && console.log('Parsing String Input')
    return parser(msg)
  }
  else if (typeof msg === 'object') {
    debug && console.log('Parsing Object Input')
    return msg
  }
}
/**
 * removes soul from given data
 * @param {*} data 
 */
export const trimSoul = data => {
  if (!data || !data['_'] || typeof data['_'] !== 'object') return data
  delete data['_']
  return data
}

/**
* Create a chain by splitting a key string, adding each split to the chain
* 
* @param {string} input `key` || `key1/key2/...`
* @param {*} chain 
*/
export const chainer = (input, chain) => {
  if (!input || !chain) {
    debug && console.log('[Chain node] no input or chain')
    return false
  }
  if (typeof input === 'string') {
    if (input.length === 0) return chain
    let inputKeys = input.split('/')
    // chainer(input, chain)
    // if (input.length === 0) return chain
    while (inputKeys.length > 0) {
      debug && console.log('[Chain node] Chaining key:', inputKeys[0])
      chain = chain.get(inputKeys[0])
      inputKeys = inputKeys.slice(1)
    }
  }
  debug && console.log('[Chain node] done.')
  return chain
}

/**
 * uses first key in a key string as channel
 * @param {string} input `key` || `key1/key2/...`
 */
export const channelSet = (input) => {
  let channel = 'done' // default value
  if (!input || typeof input !== 'string') {
    debug && console.log('[Channel node] no input')
    return channel
  }
  let inputKeys = input.split('/')
  if (inputKeys.length === 0) {
    debug && console.log('[Chain node] Channel key:', input)
    channel = input
  }
  else {
    debug && console.log('[Chain node] Channel key:', inputKeys[0])
    channel = inputKeys[0]
  }
  return channel
}

export const get = (msg) => {
  const input = inputParser(msg)
  const chain = chainer(input, app)
  // debug && console.log('[React node] Chain :', chain)
  chain.once((data, key) => {
    const foundData = trimSoul(data)
    debug && console.log('[GUN node] getOne Data Found: ', foundData)
    messenger.emit(msg, foundData)
  })
}


/**
 * Assign a value to keys, needs to parse msg first
 * @param {*} msg JSON or object
 * @param {string} msg.key `key` or `key1/key2/...`
 * @param {*} msg.value any
 * @param {string} [channel] optional channel name, default name `done`
 */
export const put = (msg) => {
  const input = inputParser(msg)
  debug && console.log('[NODE_DEBUG_PUT] : ', input)
  const chain = chainer(input.key, app)
  // debug && console.log('[React node] Chain :', chain)
  debug && console.log('[NODE_DEBUG_PUT] : ', typeof input)
  chain.put(input.value, ack => {
    const data = trimSoul(input.value)
    debug && console.log('[NODE_DEBUG_PUT] ERR? ', ack.err)
    messenger.emit('put', ack.err ? ack : data)
  })
}

/**
 * Assign a value to a set, needs to parse JSON msg first
 * @param {*} msg JSON `{key: 'key' || 'key1/key2/...', value: any}`
 */
export const set = (msg) => {
  debug && console.log('[NODE_DEBUG_SET] : parsing - ', msg)
  const input = inputParser(msg)
  debug && console.log('[NODE_DEBUG_SET] : ', input)
  const chain = chainer(input.key, app)
  // debug && console.log('[React node] Chain :', chain)
  chain.set(input.value, ack => {
    const data = trimSoul(input.value)
    debug && console.log('[NODE_DEBUG_SET] ERR? ', ack.err)
    messenger.emit('set', ack.err ? ack : data)
  })
}


export const off = msg => {
  const input = inputParser(msg)
  const chain = chainer(input.key)
  chain.off()
}
