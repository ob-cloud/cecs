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

const toAction = (action, device = {}) => {
  return {
    node_type: '00',
    ...device,
    action_name: device.name,
    action
  }
}

export const changeSwitchButtonToAction = (value, device) => {
  const status = new Array(7).fill(0)
  Array.from(value).forEach((item, index) => {
    status[0] = setMultiBitIndex(status[0], index * 2, 2, item)
  })
  return toAction(byteArrayToHexString(status), device)
}
