/*
 * @Author: eamiear
 * @Date: 2019-08-09 14:30:46
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-08-09 16:16:27
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

 class IotSuit {
   constructor () {

   }
 }
