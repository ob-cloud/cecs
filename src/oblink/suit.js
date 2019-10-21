const Suit = {
  isTransponder (deviceType) {
    return deviceType === '51'
  },
  isAcTransponder (deviceType, deviceSubType) {
    return this.isTransponder(deviceType) && deviceSubType === 7
  },
  isAcDevice (deviceSubType) {
    return deviceSubType === 7
  }
}

export default Suit
