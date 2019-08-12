/*
 * @Author: eamiear
 * @Date: 2019-08-09 14:30:46
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-08-12 11:07:22
 */

 /**
  *  type: 设备类型匹配表，由主类型、子类型编码值组成key
  *  status: 设备状态匹配表， 由主类型码+状态码组成key
  *  group: 设备类型分组，同组类型状态截码位相同
  */

const Suiter = {
  led: {
    type: {
      '01': '灯',
      '0101': '单色调光',
      '0102': '落地灯', // 冷暖色调光，双色灯
      '0103': '三色调光',
      '0111': '1路滑条调光',
      '0112': '2路滑条调光',
      '0113': '3路滑条',
      '0114': '',
      '0115': '',
      '0116': '',
      '0119': '单 + 双',
      '0120': '',
      '0121': '',
      '0122': '',
      '0132': '',
      '0133': '风扇灯'
    },
    status: {
      '0100': '关',
      '0101': '开',
      '0143': '微弱',
      '0186': '弱光',
      '01129': '亮',
      '01172': '较亮',
      '01215': '非常亮',
      '01254': '最大亮度'
    },
    group: {
      root: ['01']
    }
  },
  cooker: { // 电饭煲
    type: {
      '02': '智能电饭煲'
    }
  },
  humidifier: { // 加湿器
    type: {
      '03': '智能加湿器'
    }
  },
  socketSwitch: { // 插座开关
    type: {
      '04': '插座/开关',
      '0401': '插座',
      '0402': '面板',
      '0403': '触摸开关',
      '0412': '智能插座',
      '0413': '智能插座',
      '0414': '智能插座',

      '0421': '普通触摸开关',
      '0422': '普通触摸开关',
      '0423': '普通触摸开关',
      '0424': '普通触摸开关',
      '0425': '普通触摸开关',
      '0426': '普通触摸开关',
      '0427': '普通触摸开关',
      '0428': '普通触摸开关',

      '0431': '情景面板',
      '0432': '情景面板',
      '0433': '情景面板',
      '0436': '情景面板',

      '0441': '混合面板',
      '0442': '混合面板',
      '0443': '混合面板',

      '0451': '单火线开关',
      '0452': '单火线开关',

      '0480': '红外面板',
      '0481': '红外面板',
      '0483': '红外面板',
      '0486': '红外面板',

      '0490': 'WiFi插座',
    },
    status: {
      '0400': '关',
      '0401': '开',
      '0410': '置反',
      '0411': '保持不变'
    },
    group: { // 类别分组， 状态取值区间相同
      root: ['04'],
      // 触摸开关，子类型组
      touch: ['21', '22', '23', '24', '25', '26', '28'],
      // 情景面板
      scene: ['31', '32', '33', '35'],
      // 普通开关
      normal: ['01', '03', '12', '13', '14']
    }
  },
  switchgear: { // 开关类设备
    type: {
      '05': "",
      "0501": "窗帘",
      "0502": "投影仪幕布"
    }
  },
  fans: {
    type: {
      '06': '智能风扇'
    }
  },
  airCleaner: {
    type: {
      '07': '智能空气净化器'
    }
  },
  tv: {
    type: {
      '08': '兼容型智能电视'
    }
  },
  gateway: {
    type: {
      '10': '网关',
      '1001': '通用版本',
      '1002': '阿里版本'
    }
  },
  sensors: {
    type: {
      "11": "传感器",
      "1101": "ALS",
      "1102": "水浸",
      "1103": "雷达",
      "1104": "CO",
      "1105": "环境",
      "1106": "人体感应",
      "1107": "空气质量",
      "1108": "供电检测器",
      "1109": "虚拟雷达",
      "1110": "光线传感器",
      "1111": "温度湿度传感器",
      "1112": "烟雾传感器",
      "1113": "超声波传感器",
      "1114": "雷达传感器",
      "1115": "插卡取电", // 插卡传感器
      "1116": "环境传感器",
      "1117": "感应面板",
      "1118": "DC供电版红外",
      "1119": "AC红外",
      "1120": "PM2.5",
      "1121": "门窗磁",// 门磁
      "1122": "雷达灯"
    },
    status: {
      // AC 红外
      '1100': '无人',
      '1101': '有人',
      // 插卡取电
      '11fe': '通电导通',
      '11fd': '断电',
      '11ff': '首次上电'
    },
    group: {
      root: ['11'],
      als: ['01'],
      water: ['02'],
      radar: ['03'],
      co: ['04'],
      env: ['05'],
      body: ['06'],
      electric: ['08'],
      virtualRadar: ['09'],
      light: ['10'],
      humidifier: ['11'],
      smoke: ['12'],
      wave: ['13'],
      radarSence: ['14'],
      cardSense: ['15'],
      envSense: ['16'],
      induction: ['17'],
      dc: '18',
      ac: '19',
      pm: ['20'],
      gate: ['21'],
      radarLight: ['22']
    }
  },
  meterReader: {
    type: {
      '12': '智能抄表器',
      '1201': '智能抄表器'
    }
  },
  wireControlPanel: {
    type: {
      '13': '线控面板',
      '1301': '空调线控器'
    }
  },
  transponder: {
    type: {
      '14': '红外转发器',
      '1401': '蓝牙',
      '1402': 'wifi',
      '1403': '红外线控面板'
    }
  },
  remoteControl: {
    type: {
      '15': '遥控设备',
      '1501': '手持单向遥控器'
    }
  },
  autoMover: {
    type: {
      '16': '智能自行设备',
      '1601': '四旋翼飞行器',
      '1602': '机械车'
    }
  },
  doorLock: {
    type: {
      "21": "锁",
      "2101": "亚太天能智能门锁",
      "2102": "亿万家智能门锁",
      "2103": "OB智能门锁",
      "2104": "OB酒店门锁"
    },
    status: {
      '2100': '指纹开锁',
      '2101': '密码开锁',
      '2102': '卡开锁',
      '2103': '钥匙开锁',
      '2104': '遥控开锁',
      '2105': '临时用户开锁',
      '21-1': '关闭'
    },
    group: {
      root: ['21']
    }
  },
  remoteControlLamp: {
    type: {
      '22': '遥控灯',
      '2201': '遥控灯'
    }
  },
  obox: {
    type: {
      '10': 'obox',
      '1010': 'obox'
    },
    satus: { // device_type + status
      '100': '离线',
      '101': '在线'
    },
    group: {
      root: ['10']
    }
  }
}

// 套件类型
const SuitTypes = (Array.from(Object.keys(Suiter)).reduce((item, next, index)=> {
  if (index === 1) {
    item = Suiter[item].type
  }
  return {...item, ...(Suiter[next].type)}
}))

// 套件状态
const SuitStatus = (Array.from(Object.keys(Suiter)).reduce((item, next, index)=> {
  if (index === 1) {
    item = Suiter[item].status
  }
  return {...item, ...(Suiter[next].status)}
}))

const Converter = (() => {
  /**
   * 进制转换
   * @param {string|number} number 转换的值
   * @param {number} from 从2|8|10|16转成 to 进制
   * @param {number} to 目标进制
   */
  function _fn (number, from, to) {
    return parseInt(number, +from).toString(+to)
  }
  function toBinary (number, from) {
    return _fn(number, from).toString(2)
  }
  function toOctal (number, from) {
    const radix = _fn(number, from, 8)
    return +radix < 8 ? '0' + radix : radix
  }
  function toDecimal (number, from) {
    const radix = _fn(number, from, 10)
    return +radix < 10 ? '0' + radix : radix
  }
  function toHex (number, from) {
    const radix = _fn(number, from, 16)
    return +radix < 16 ? '0' + radix : radix
  }
  return {
    toBinary,
    toDecimal,
    toOctal,
    toHex
  }
})()

class TypeHints {
  constructor () {
    this.converter = Converter
    this.__rootProcessor()
    this.__subDeviceProcessor()
  }
  /**
   * 判断套件设备一级类型
   * @param {object} suitsType 套件类型对象
   * @param {number} type 套件类型
   * @param [options] {number}  subType 套件子类型
   */
  __handler (suitsType, type, subType) {
    if (!suitsType) return false
    if (!subType) {
        return !!suitsType[this.converter.toDecimal(type, 16)]
    }
    const typeStr = this.converter.toDecimal(type, 16) + this.converter.toDecimal(subType, 16)
    return !!suitsType[typeStr]
  }
  __handleSubType (group, subType) {
    return group.includes(this.converter.toDecimal(subType, 16))
  }
  /**
   * 一级设备类型判断方法生成器
   * this.isSensor = (type, subType) => {}
   */
  __rootProcessor () {
    const typeList = Array.from(Object.keys(Suiter)).map(item => item.slice(0, 1).toUpperCase() + item.slice(1))
    typeList.forEach(item => {
      this[`is${item}`] = (deviceType, deviceSubType) => {
        return this.__handler(Suiter[item.toLocaleLowerCase()], deviceType, deviceSubType)
      }
    })
  }
  /**
   * 子设备类型，判断方法生成器
   * this.isTouchSensor = (deviceSubType) => {}
   */
  __subDeviceProcessor () {
    Array.from(Object.keys(Suiter)).map(item => {
      const group = Suiter[item].group
      const itemKey = item.slice(0, 1).toUpperCase() + item.slice(1) // sensors --> Sensors
      if (!group) return
      Array.from(Object.keys(group)).map((groupKey) => {
        const key = groupKey.slice(0, 1).toUpperCase() + groupKey.slice(1) // touch --> Touch
        this[`is${key}${itemKey}`] = (deviceSubType) => { // this.isTouchSensor = (deviceSubType) => {}
          return this.__handleSubType(group[groupKey], deviceSubType)
        }
      })
    })
  }
}

/**
 * @class
 * @classdesc 状态描述器 命名规则： get[设备类型名称]StatusDescriptor； 设备类型名称与SuiterMap配置表的key字段相同，如led --> getLedStatusDescriptor
 */
class StatusDescriptor {
  constructor () {
    this.suitStatus = SuitStatus
    this.converter = Converter
    this.typeHints = new TypeHints()
  }
  /**
   * 设备类型码+状态码
   * @param {string} deviceType 设备类型码
   * @param {string} status 状态码
   */
  __getStatusKey (deviceType, status) {
    return `${deviceType}${status}`
  }
  /**
   * 组合状态描述 -- 010010 --> 开/关/置反
   * @param {string} deviceType 设备类型
   * @param {string | number} number 16进制状态码
   */
  __combineStatus (deviceType, number) {
    const binary = this.converter.toBinary(number, 16)
    let descriptor = ''
    let binaryList = binary.length % 2 ? `0${binary}` : binary
    for (let i = 0; i <= binaryList.length; i+2) {
      descriptor += this.suitStatus[this.__getStatusKey(deviceType, binary.slice(i, i + 2))] + '/'
    }
    return descriptor.slice(0, -1)
  }
  /**
   * 获取插座开关状态
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   * @param {string} deviceSubType 设备子类型状态码
   */
  getSocketSwitchStatusDescriptor (status, deviceType, deviceSubType) {
    if (!deviceSubType) return this.suitStatus[this.__getStatusKey(deviceType, status.slice(6, 8))]

    if (this.typeHints.isTouchSocketSwitch(deviceSubType) || this.typeHints.isNormalSocketSwitch(deviceSubType)) {
      return this.__combineStatus(deviceType, status.slice(0, 2))
    }

    if (this.typeHints.isSceneSocketSwitch(deviceSubType)) {
      return this.__combineStatus(deviceType, status.slice(6, 8))
    }
  }
  /**
   * 获取LED灯状态
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */
  getLedStatusDescriptor (status, deviceType) {
    const light = this.converter.toBinary(status.slice(0, 2))
    if (+light > 1) {
      let code = light < 43 ? '43' : (light > 43 && light < 86 ? '86' : (light > 86 && light < 129 ? '129' : (light > 129 && light < 172 ? '172' : (light < 172 && light > 215 ? '215' : '254'))))
      return this.suitStatus[this.__getStatusKey(deviceType, code)]
    } else {
      return this.suitStatus[this.__getStatusKey(deviceType, status.slice(0, 2))]
    }
  }
  /**
   * 获取传感器状态
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   * @param {string} deviceSubType 设备子类型状态码
   */
  getSensorsStatusDescriptor (status, deviceType, deviceSubType) {
    // ac sensor
    if (!deviceSubType || this.typeHints.isAcSensor(deviceSubType)) return this.suitStatus[this.__getStatusKey(deviceType, status.slice(8, 10))]

    // cardSenseSensor
    if (this.typeHints.isCardSenseSensors(deviceSubType)) return this.suitStatus[this.__getStatusKey(deviceType, status.slice(0, 2))]
  }
  /**
   * 获取门锁状态
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */
  getLockStatusDescriptor (status, deviceType) {
    const cmd = status.slice(2, 4)
    const cmdMap = {
      'c3': this.converter.toDecimal(status.slice(10, 12), 16),
      'cd': '2'
    }
    return this.suitStatus[this.__getStatusKey(deviceType, (cmdMap[cmd] || '-1'))]
  }
  /**
   * 获取OBOX状态
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */
  getOboxStatusDescriptor(status, deviceType) {
    return this.suitStatus[this.__getStatusKey(deviceType, status.slice(0, 1))]
  }
  /**
   * 获取电饭煲状态
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */
  getCookerStatusDescriptor(status, deviceType) {

  }
  /**
   * 获取加湿器状态
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */
  getHumidifierStatusDescriptor(status, deviceType) {

  }
  /**
   * 获取可开关类设备状态
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */
  getSwitchgearStatusDescriptor(status, deviceType) {

  }
  /**
   * 风扇状态
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */
  getFansStatusDescriptor(status, deviceType) {

  }
  /**
   * 空气清洁器状态
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */
  getAirCleanerStatusDescriptor(status, deviceType) {

  }
  /**
   * tv
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */
  getTvStatusDescriptor(status, deviceType) {

  }
  /**
   * 网关
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */
  getGateWayStatusDescriptor(status, deviceType) {

  }
  /**
   * 抄表器
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */
  getMeterReaderStatusDecriptor(status, deviceType) {

  }
  /**
   * 远程控制面板
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */
  getWireControlPanelStatusDescriptor(status, deviceType) {

  }
  /**
   * 转发器
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */
  getTransponderStatusDescriptor(status, deviceType) {

  }
  /**
   * 远程控制
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */
  getRemoteControlStatusDescriptor(status, deviceType) {

  }
  /**
   * 自动移动器
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */
  getAutoMoverStatusDescriptor(status, deviceType) {

  }
  /**
   * 远程控制灯
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */
  getRemoteControlLampStatusDescriptor(status, deviceType) {

  }
}

 class Suit {
  constructor () {
    this.converter = Converter
    this.typeHints = new TypeHints()
    this.statusDescriptor = new StatusDescriptor()
  }
  /**
   * 获取主设备类型描述信息
   * @param {string} deviceType 设备类型
   */
  getRootDeviceDescriptor (deviceType) {
    return SuitTypes[this.converter.toDecimal(deviceType, 16)]
  }
  /**
   * 设备子类型
   * @param {string} deviceType 设备类型
   * @param {string} deviceSubType 设备子类型
   */
  getDeviceTypeDescriptor (deviceType, deviceSubType) {
    const typeStr = this.converter.toDecimal(deviceType, 16)
    const subTypeStr = this.converter.toDecimal(deviceSubType, 16)
    return SuitTypes[typeStr + subTypeStr]
  }
  /**
   * 设备状态
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型
   * @param {string} deviceSubType 设备子类型
   */
  getStatusDescriptor (status, deviceType, deviceSubType) {
    let statusDescriptor = ''
    Array.from(Object.keys(this.typeHints)).forEach(typeHintKey => {
      if (this.typeHints[typeHintKey].call(this.typeHints, deviceType, deviceSubType)) {
        const statusMethodName = `get${typeHintKey.replace('is', '')}StatusDescriptor`
        if (this.statusDescriptor[statusMethodName]) {
          statusDescriptor = this.statusDescriptor[statusMethodName].call(this.statusDescriptor, status, deviceType, deviceSubType)
          return statusDescriptor
        }
      }
    })
    return statusDescriptor
  }
 }

console.log(new Suit())
