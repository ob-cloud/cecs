const setMultiBitIndex = (src, start, len, value) => {
  for (let i = 0; i < len; i++) {
    if (((value >> i) & 1) === 1) {
      src |= (1 << start + i)
    } else {
      src &= ~(1 << start + i)
    }
  }
  return src
}
const byteArrayToHexString = src => {
  if (!src || !src.length) return
  let hexStr = ''
  Array.from(src).forEach(item => {
    const hex = parseInt(item, 10).toString(16)
    if (hex.length < 2) {
      hexStr += '0'
    }
    hexStr += hex
  })
  return hexStr
}

const toAction = (action, device = {}, room = {}) => {
  return {
    node_type: '00',
    ...device,
    action_name: device.name,
    action,
    ...room
  }
}

export const getSwitchButtonStatus = value => {
  const status = new Array(7).fill(0)
  Array.from(value).forEach((item, index) => {
    status[0] = setMultiBitIndex(status[0], index * 2, 2, item)
  })
  let action = byteArrayToHexString(status)
  action = action.slice(0, -1) + '2'
  return action
}

export const changeSwitchButtonToAction = (value, device, room) => {
  const status = new Array(7).fill(0)
  Array.from(value).forEach((item, index) => {
    status[0] = setMultiBitIndex(status[0], index * 2, 2, item)
  })
  let action = byteArrayToHexString(status)
  action = action.slice(0, -1) + '2'
  return toAction(action, device, room)
}

export const changeAirConditionToAction = (action, device, room) => {
  return toAction(action, {'device_child_type': '01', addr: 'fe', 'device_type': device.deviceType, name: device.name, index: device.index, node_type: '07'}, room)
}

export const getAireConditionPowerKey = power => {
  return power ? 'on' : 'off'
}
export const getAirConditionKeys = (templure, mode, speed, windVertical, windHorizon) => {
  const modeMap = {0: 'a', 1: 'r', 2: 'd', 3: 'w', 4: 'h'}[mode]
  const speedMap = {0: 's0', 1: 's1', 2: 's2', 3: 's3'}[speed]
  const windVerticalMap = {0: 'u0', 1: 'u1'}[windVertical] || ''
  const windHorizonMap = {0: 'l0', 1: 'l1'}[windHorizon] || ''
  return `${modeMap}_${speedMap}_${[1, 3, 4].includes(mode) ? templure : ''}_${windVerticalMap}_${windHorizonMap}_p0`
}

export const hasVerticalWind = keys => {
  if (!keys || !keys.length) return false
  const index = keys.findIndex(item => {
    const key = item.key
    return key.includes('_') && (key.includes('u0') || key.includes('u1')) && !key.includes('*')
  })
  return index !== -1
  // const key = keys[0].key
  // return key.includes('_') && (key.includes('u0') || key.includes('u1')) && !key.includes('*')
}

export const hasHorizontalWind = keys => {
  if (!keys || !keys.length) return false
  const index = keys.findIndex(item => {
    const key = item.key
    return key.includes('_') && (key.includes('l0') || key.includes('l1')) && !key.includes('*')
  })
  return index !== -1
  // const key = keys[0].key
  // return key.includes('_') && (key.includes('l0') || key.includes('l1')) && !key.includes('*')
}

export const isV3Ac = rmodel => {
  return rmodel && rmodel.toLowerCase().includes('v3')
}
