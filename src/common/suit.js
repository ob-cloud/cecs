/*eslint-disable */
/*
 * @Author: eamiear
 * @Date: 2019-08-12 11:21:09
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-11-13 13:52:52
 */

/**
 * 进制转换
 * @ignore
 * @param {string|number} number 转换的值
 * @param {number} from 从2|8|10|16转成 to 进制
 * @param {number} to 目标进制
 */
function _fn(number, from, to) {
  return parseInt(number, +from).toString(+to);
}
/**
 * 转为二进制字符串
 * @memberof Converter
 * @param {String|Number} number 转换的值
 * @param {Number} from x进制值
 * @example
 * Converter.toBinary('aa', 16)
 */


function toBinary(number, from) {
  return _fn(number, from, 2);
}
/**
 * 转为八进制字符串
 * @memberof Converter
 * @param {String|Number} number 转换的值
 * @param {Number} from x进制值
 * @example
 * Converter.toOctal('aa', 16)
 */


function toOctal(number, from) {
  const radix = _fn(number, from, 8);

  return +radix < 8 ? '0' + radix : radix;
}
/**
 * 转为十进制字符串
 * @memberof Converter
 * @param {String|Number} number 转换的值
 * @param {Number} from x进制值
 * @example
 * Converter.toDecimal('ff', 16)
 */


function toDecimal(number, from) {
  const radix = _fn(number, from, 10);

  return +radix < 10 ? '0' + radix : radix;
}
/**
 * 转为16进制字符串
 * @public
 * @memberof Converter
 * @param {String|Number} number 转换的值
 * @param {Number} from x进制值
 * @example
 * Converter.toHex('1011', 2)
 */


function toHex(number, from) {
  const radix = _fn(number, from, 16);

  return +radix < 10 ? '0' + radix : radix;
}
/**
 * 进制转换器
 * @namespace  Converter
 */


const Converter = {
  toBinary,
  toDecimal,
  toOctal,
  toHex
};

/*
 * @Author: eamiear
 * @Date: 2019-08-12 11:21:50
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-08-23 15:47:11
 */

/**
 * @description 套件配置表模块<br>
 * <pre>
 *  type: 设备类型匹配表，由主类型、子类型编码值组成key <br/>
 *  status: 设备状态匹配表， 由主类型码+状态码组成key<br/>
 *  group: 设备类型分组，同组类型状态截码位相同<br/>
 * </pre>
 * @namespace
 * @name Suiter
 */
const Suiter = {
  /**
   * 灯
   * @namespace Suiter.led
   */
  led: {
    /** led.type 类型*/
    type: {
      '01': '灯',
      '0101': '单色光',
      '0102': '落地灯',
      // 冷暖色调光，双色灯
      '0103': '三色光',
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

    /** led.status 状态*/
    status: {// '0100': '关',
      // '0101': '开',
      // '0143': '微弱',
      // '0186': '弱光',
      // '01129': '亮',
      // '01172': '较亮',
      // '01215': '非常亮',
      // '01254': '最大亮度'
    },

    /** led.group 状态分组*/
    group: {
      root: ['01'],
      simple: ['01', '02'],
      color: ['03'],
      way: ['13']
    }
  },

  /**
   * 电饭煲
   * @namespace Suiter.cooker
  */
  cooker: {
    // 电饭煲
    type: {
      '02': '智能电饭煲'
    }
  },

  /**
   * 加湿器
   * @namespace Suiter.humidifier
  */
  humidifier: {
    // 加湿器
    type: {
      '03': '智能加湿器'
    }
  },

  /**
   * 插座开关
   * @namespace Suiter.socketSwitch
  */
  socketSwitch: {
    // 插座开关
    type: {
      '04': 'Switcher',
      '0401': '智能插座',
      '0402': '单线开关',
      '0403': '触摸开关',
      '0412': '智能插座',
      '0413': '智能插座',
      '0414': '智能插座',
      '0421': '1路开关',
      '0422': '2路开关',
      '0423': '3KeySwitch',
      '0424': '4路开关',
      '0425': '普通触摸开关',
      '0426': '普通触摸开关',
      '0427': '普通触摸开关',
      '0428': '普通触摸开关',
      '0431': '一路情景面板',
      '0432': '两路情景面板',
      '0433': '3路情景面板',
      '0434': '4路情景面板',
      '0436': '六键情景',
      '0441': '1路开关 + 3路情景面板',
      '0442': '2路开关 + 3路情景面板',
      '0443': '3路开关 + 3路情景面板',
      '0451': '一键单线开关',
      '0452': '二键单线开关',
      '0462': '2开关+2情景面板',
      '0480': '红外面板',
      '0481': '红外面板',
      '0483': '红外面板',
      '0486': '六键情景+红外对管',
      '0490': 'WiFi插座',
      '0491': '单一窗帘面板',
      '0492': '两个窗帘面板'
    },
    status: {
      '0400': '关',
      '0401': '开',
      '0410': '置反',
      '0411': '保持不变',
      // 0401 socket 4位bit，按含1开，不含1关处理
      '04s1': '开',
      '04s0': '关'
    },
    group: {
      // 类别分组， 状态取值区间相同，配置后会自动生成相应的判断方法
      root: ['04'],
      // 触摸开关，子类型组 byte[0]
      touch: ['02', '21', '22', '23', '24', '25', '26', '28', '51', '52'],
      // 情景面板
      scene: ['31', '32', '33', '34', '35', '36'],
      // 混合面板 byte[1]
      mix: ['41', '42', '43', '62', '83', '86'],
      // 普通开关
      normal: ['03', '12', '13', '14'],
      // 插座 byte[0]
      simple: ['01'],
      threeKey: ['23']
    }
  },

  /**
   * 开关类设备
   * @namespace Suiter.switchgear
  */
  switchgear: {
    // 开关类设备
    type: {
      '05': "",
      "0501": "窗帘",
      "0502": "投影仪幕布"
    },
    status: {
      '0500': '关',
      '0501': '停',
      '0510': '开'
    }
  },

  /**
   * 智能风扇
   * @namespace Suiter.fans
  */
  fans: {
    type: {
      '06': '智能风扇'
    }
  },

  /**
   * 智能空气净化器
   * @namespace Suiter.airCleaner
  */
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
  usbRf: {
    type: {
      '09': '测试用USB_RF模块'
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
      "11": "Sensor",
      "1101": "光明",
      "1102": "水浸",
      "1103": "雷达",
      "1104": "CO",
      "1105": "环境（光湿温）",
      "1106": "人体感应（雷达+红外）",
      "1107": "空气质量（PM2.5+VOC）",
      "1108": "供电检测器",
      "1109": "虚拟雷达",
      "1110": "光线传感器",
      "1111": "HumidSensors",
      "1112": "烟雾传感器",
      "1113": "超声波传感器",
      "1114": "雷达传感器",
      "1115": "插卡取电",
      // 插卡传感器
      "1116": "环境传感器",
      "1117": "感应面板",
      "1118": "DC红外",
      "1119": "AC红外",
      "1120": "PM2.5",
      "1121": "门窗磁",
      // 门磁
      "1122": "雷达灯",
      "1123": "DC人体+光感",
      "1124": "AC人体+光感"
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
    },
    group: {
      root: ['11'],
      ac: ['01']
    },
    status: {
      '1300': '关',
      '1301': '开'
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
      '15': '智能遥控设备',
      '1501': '手持单向遥控器'
    }
  },
  autoMover: {
    type: {
      '16': '智能自行设备',
      '1601': '飞机',
      '1602': '机械车'
    },
    group: {
      plane: ['01']
    }
  },
  camera: {
    type: {
      '17': '智能摄像类设备',
      '1701': '固定摄像设备（家用）',
      '1702': '防抖摄像设备（配合云台）'
    },
    group: {
      root: ['17'],
      fixed: ['01'],
      moving: ['02']
    }
  },
  finger: {
    type: {
      '16': '智能门禁，中控指纹机'
    }
  },
  doorLock: {
    type: {
      "21": "锁",
      "2101": "亚太天能智能门锁",
      "2102": "亿万家智能门锁",
      "2103": "家居门锁",
      "2104": "酒店门锁"
    },
    status: {
      '2100': '指纹开锁',
      '2101': '密码开锁',
      '2102': '卡开锁',
      '2103': '钥匙开锁',
      '2104': '遥控开锁',
      '2105': '临时用户开锁',
      '21-1': '关闭',
      '21open0': '指纹开锁',
      '21open1': '密码开锁',
      '21open2': '卡开锁',
      '21open3': '钥匙开锁',
      '21open4': '遥控开锁',
      '21open5': '临时用户开锁',
      '21close4': '反锁',
      '21close5': '门关闭',
      '21close7': '掩门',
      '21close8': '锁开',
      '21close9': '反锁开',
      '21card': '门卡开锁',
      'default': '关门'
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
  smartCamera: {
    type: {
      '32': '摄像头'
    }
  },
  wifiSocket: {
    type: {
      '80': '单品wifi插座'
    }
  },
  wifiIr: {
    type: {
      '81': 'Ifrate'
    }
  },
  obox: {
    type: {
      '10': 'obox',
      '1010': 'obox'
    },
    satus: {
      // device_type + status
      '100': '离线',
      '101': '在线'
    },
    group: {
      root: ['10']
    }
  }
  /**
   * 套件类型
   * @const
   * @memberof Suiter
   * @name SuitTypes
   */

};
const SuitTypes = Array.from(Object.keys(Suiter)).reduce((item, next, index) => {
  if (index === 1) {
    item = Suiter[item].type;
  }

  return { ...item,
    ...Suiter[next].type
  };
});
/**
 * 套件状态
 * @const
 * @memberof Suiter
 * @name SuitStatus
 */

const SuitStatus = Array.from(Object.keys(Suiter)).reduce((item, next, index) => {
  if (index === 1) {
    item = Suiter[item].status;
  }

  return { ...item,
    ...Suiter[next].status
  };
});

String.prototype.toCapital = function () {
  return this.slice(0, 1).toUpperCase() + this.slice(1);
};

String.prototype.toLower = function () {
  return this.slice(0, 1).toLowerCase() + this.slice(1);
};

/*
 * @Author: eamiear
 * @Date: 2019-08-12 11:22:42
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-08-22 18:12:32
 */
/**
 * 类型检测器
 * @class
 * @name TypeHints
 */

class TypeHints {
  constructor() {
    this.__rootProcessor();

    this.__subDeviceProcessor();
  }
  /**
   * 判断套件设备一级类型
   * @private
   * @name __handler
   * @param {object} suitsType 套件类型对象
   * @param {number} type 套件类型
   * @param {number} [subType]  套件子类型
   */


  __handler(suitsType, type, subType) {
    if (!suitsType) return false;

    if (!subType) {
      return !!suitsType[Converter.toDecimal(type, 16)];
    }

    const typeStr = Converter.toDecimal(type, 16) + Converter.toDecimal(subType, 16);
    return !!suitsType[typeStr];
  }
  /**
   * 设备子类型处理器
   * @private
   * @name __handleSubType
   * @param {Object} group 子类型分组
   * @param {String} subType 子设备类型
   */


  __handleSubType(group, subType) {
    return group.includes(Converter.toDecimal(subType, 16));
  }
  /**
   * 一级设备类型判断方法生成器
   * @private
   *
   * @example
   * this.isSensor = (type, subType) => {}
   */


  __rootProcessor() {
    // const typeList = Array.from(Object.keys(Suiter)).map(item => item.slice(0, 1).toUpperCase() + item.slice(1))
    // typeList.forEach(item => {
    //   this[`is${item}`] = (deviceType, deviceSubType) => {
    //     return this.__handler(Suiter[item.toLocaleLowerCase()], deviceType, deviceSubType)
    //   }
    // })
    Array.from(Object.keys(Suiter)).map(item => {
      const types = Suiter[item].type;
      const keyCapital = item.toCapital();

      this[`is${keyCapital}`] = (deviceType, deviceSubType) => {
        return this.__handler(types, deviceType, deviceSubType);
      };
    });
  }
  /**
   * 子设备类型，判断方法生成器
   * @private
   * @example
   * this.isTouchSensor = (deviceSubType) => {}
   */


  __subDeviceProcessor() {
    Array.from(Object.keys(Suiter)).map(item => {
      const group = Suiter[item].group;
      const itemKey = item.toCapital(); // sensors --> Sensors

      if (!group) return;
      Array.from(Object.keys(group)).map(groupKey => {
        const key = groupKey.toCapital(); // touch --> Touch

        this[`is${key}${itemKey}`] = deviceSubType => {
          // this.isTouchSensor = (deviceSubType) => {}
          return this.__handleSubType(group[groupKey], deviceSubType);
        };
      });
    });
  }

}

var TypeHints$1 = new TypeHints();

/*
 * @Author: eamiear
 * @Date: 2019-08-12 11:25:00
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-08-23 10:59:47
 */
/**
 * @class
 * @classdesc 状态描述器<br>
 *
 * <pre>
 * 命名规则： get[设备类型名称]StatusDescriptor； 设备类型名称与SuiterMap配置表的key字段相同，<br>
 * 如led --> getLedStatusDescriptor<br>
 * </pre>
 */

class StatusDescriptor {
  constructor() {}
  /**
   * 设备类型码+状态码
   * @private
   * @param {string} deviceType 设备类型码
   * @param {string} status 状态码
   */


  __getStatusKey(deviceType, status) {
    return `${deviceType}${status}`;
  }
  /**
   * 组合状态描述 -- 010010 --> 开/关/置反
   * @private
   * @param {string} deviceType 设备类型
   * @param {string | number} number 16进制状态码
   */


  __combineSocketStatus(deviceType, number) {
    let bitStr = Converter.toBinary(number, 16);
    let descriptor = []; // 长度，奇数转偶数

    bitStr = bitStr.length % 2 ? `0${bitStr}` : bitStr;

    for (let i = bitStr.length; i > 0; i -= 2) {
      descriptor.push(SuitStatus[this.__getStatusKey(deviceType, bitStr.slice(i - 2, i))]);
    }

    return descriptor.join(',');
  }
  /**
   * 0401 socket 取第一个字节，后四位bit决定状态（特殊: 一个位一个状态）
   * @private
   * @param {string} status 16进制状态码
   */


  __parseSimpleSocket(deviceType, status) {
    let bitStr = Converter.toBinary(status.slice(0, 2), 16);
    bitStr = bitStr.slice(-4);
    return SuitStatus[this.__getStatusKey(deviceType, `s${bitStr.includes('1') ? 1 : 0}`)];
  }
  /**
   * 获取插座开关状态
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   * @param {string} deviceSubType 设备子类型状态码
   */


  getSocketSwitchStatusDescriptor(status, deviceType, deviceSubType) {
    if (!deviceSubType) return SuitStatus[this.__getStatusKey(deviceType, status.slice(6, 8))]; // 智能插座

    if (TypeHints$1.isSimpleSocketSwitch(deviceSubType)) {
      return this.__parseSimpleSocket(deviceType, status);
    } // TODO 单键、双键、三键、四键开关区分 ==》 开、开/关、开/开/关、关/关/关/开


    if (TypeHints$1.isTouchSocketSwitch(deviceSubType) || TypeHints$1.isNormalSocketSwitch(deviceSubType)) {
      return this.__combineSocketStatus(deviceType, status.slice(0, 2));
    }

    if (TypeHints$1.isMixSocketSwitch(deviceSubType)) {
      return this.__combineSocketStatus(deviceType, status.slice(2, 4));
    }

    if (TypeHints$1.isSceneSocketSwitch(deviceSubType)) {
      return this.__combineSocketStatus(deviceType, status.slice(6, 8));
    }
  }
  /**
   * 获取LED灯状态
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */


  getLedStatusDescriptor(status, deviceType, deviceSubType) {
    let light = 0;
    let num = +Converter.toDecimal(status.slice(0, 2), 16);

    if (TypeHints$1.isSimpleLed(deviceSubType)) {
      light = num === 0 ? 0 : `${parseInt((num - 128) * 100 / 126)}%`;
    }

    if (TypeHints$1.isColorLed(deviceSubType)) {
      light = `${num}%`;
    }

    if (TypeHints$1.isWayLed(deviceSubType)) {
      light = `${num}% ${+Converter.toDecimal(status.slice(2, 4), 16)}% ${+Converter.toDecimal(status.slice(4, 6), 16)}%`;
    }

    return light ? '开' : '关';
  }
  /**
   * 获取传感器状态
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   * @param {string} deviceSubType 设备子类型状态码
   */


  getSensorsStatusDescriptor(status, deviceType, deviceSubType) {
    // ac sensor
    if (!deviceSubType || TypeHints$1.isAcSensors(deviceSubType)) return SuitStatus[this.__getStatusKey(deviceType, status.slice(8, 10))]; // cardSenseSensor

    if (TypeHints$1.isCardSenseSensors(deviceSubType)) return SuitStatus[this.__getStatusKey(deviceType, status.slice(0, 2))];
  }
  /**
   * 获取门锁状态
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */


  getDoorLockStatusDescriptor(status, deviceType) {
    // const cmd = status.slice(2, 4)
    // const cmdMap = {
    //   'c3': Converter.toDecimal(status.slice(10, 12), 16),
    //   'cd': '2'
    // }
    // return SuitStatus[this.__getStatusKey(deviceType, (cmdMap[cmd] || '-1'))]
    const _this = this;

    function _openTypeStatus(byte) {
      return SuitStatus[_this.__getStatusKey(deviceType, `open${Converter.toDecimal(byte, 16)}`)];
    }

    function _closeTypeStatus(byte) {
      return SuitStatus[_this.__getStatusKey(deviceType, `close${Converter.toDecimal(byte, 16)}`)];
    }

    const cmd = status.slice(0, 2);
    const cmdMap = {
      '0xc3': _openTypeStatus(status.slice(8, 10)),
      '0xcd': SuitStatus[this.__getStatusKey(deviceType, 'card')],
      '0xc6': _closeTypeStatus(status.slice(2, 4))
    };
    return cmdMap[cmd] || SuitStatus['default'];
  }
  /**
   * 获取OBOX状态
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */


  getOboxStatusDescriptor(status, deviceType) {}
  /**
   * 获取电饭煲状态
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */


  getCookerStatusDescriptor(status, deviceType) {}
  /**
   * 获取加湿器状态
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */


  getHumidifierStatusDescriptor(status, deviceType) {}
  /**
   * 获取可开关类设备状态
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */


  getSwitchgearStatusDescriptor(status, deviceType) {
    const hexbyte = status.slice(0, 2);
    const num = Converter.toDecimal(hexbyte, 16);

    if (num === 4) {
      return Converter.toDecimal(status.slice(2, 4), 16) + '%';
    } else {
      return SuitStatus[this.__getStatusKey(deviceType, hexbyte)];
    }
  }
  /**
   * 风扇状态
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */


  getFansStatusDescriptor(status, deviceType) {}
  /**
   * 空气清洁器状态
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */


  getAirCleanerStatusDescriptor(status, deviceType) {}
  /**
   * tv
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */


  getTvStatusDescriptor(status, deviceType) {}
  /**
   * 网关
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */


  getGateWayStatusDescriptor(status, deviceType) {}
  /**
   * 抄表器
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */


  getMeterReaderStatusDecriptor(status, deviceType) {}
  /**
   * 远程控制面板
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */


  getWireControlPanelStatusDescriptor(status, deviceType, deviceSubType) {
    if (this.isAcWireControlPanel(deviceSubType)) {
      return SuitStatus[this.__getStatusKey(deviceType, status.slice(0, 2))];
    }
  }
  /**
   * 转发器
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */


  getTransponderStatusDescriptor(status, deviceType) {}
  /**
   * 远程控制
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */


  getRemoteControlStatusDescriptor(status, deviceType) {}
  /**
   * 自动移动器
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */


  getAutoMoverStatusDescriptor(status, deviceType) {}
  /**
   * 远程控制灯
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型状态码
   */


  getRemoteControlLampStatusDescriptor(status, deviceType) {}

}

var StatusDescriptor$1 = new StatusDescriptor();

/*
 * @Author: eamiear
 * @Date: 2019-08-12 11:28:24
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-08-23 17:45:24
 */
/**
 * 套件类： 使用时主要使用该类中的方法
 * <pre>
 * 协议格式：
 * ===================================================
 * | 节点完整地址 | 情景开关状态 | 按键开关状态 | 填充0 |
 * ===================================================
 * | 7 bytes     | 1bytes      | bytes      |44bytes|
 * ===================================================
 *
 * 结果返回状态state值："0008000000000000"
 * 16个字符 8 个字节
 *
 * 这里的state值只包含状态字节值，不包含“地址节点”：
 *
 * 00 08 000000000000
 *
 * 00 表示情景开关状态字节
 * 08 表示按键开关状态字节
 * 后面的0为填充值
 * </pre>
 * @class
 * @name Suit
 */

class Suit {
  constructor() {
    /**
     * 类型检测器
     * @memberof Suit
     */
    this.typeHints = TypeHints$1;
    /**
     * 状态描述器
     * @memberof Suit
     */

    this.statusDescriptor = StatusDescriptor$1;
    /**
     * 进制转换器
     * @memberof Suit
     */

    this.converter = Converter;
  }
  /**
   * 获取主设备类型描述信息
   * @param {string} deviceType 设备类型
   * @returns 设备类型值
   * @example
   * new Suit().getRootDeviceDescriptor('04')
   */


  getRootDeviceDescriptor(deviceType) {
    return SuitTypes[Converter.toDecimal(deviceType, 16)];
  }
  /**
   * 设备子类型
   * @param {string} deviceType 设备类型
   * @param {string} deviceSubType 设备子类型
   * @example
   * new Suit().getDeviceTypeDescriptor('04', '53')
   * @returns 设备类型描述
   */


  getDeviceTypeDescriptor(deviceType, deviceSubType) {
    const typeStr = Converter.toDecimal(deviceType, 16);
    const subTypeStr = Converter.toDecimal(deviceSubType, 16);
    return SuitTypes[typeStr + subTypeStr];
  }
  /**
   * 设备状态
   * @param {string} status 16进制状态码
   * @param {string} deviceType 设备类型
   * @param {string} deviceSubType 设备子类型
   * @example
   * new Suit().getStatusDescriptor('0008001521000000', '04', '53')
   */


  getStatusDescriptor(status, deviceType, deviceSubType) {
    const typeKey = Array.from(Object.keys(Suiter)).find(key => {
      const capKey = key.toCapital();
      return this.typeHints[`is${capKey}`].call(this.typeHints, deviceType);
    });
    const statusMethodName = `get${typeKey.toCapital()}StatusDescriptor`;

    if (this.statusDescriptor[statusMethodName]) {
      return this.statusDescriptor[statusMethodName].call(this.statusDescriptor, status, deviceType, deviceSubType);
    }
  }

}

var index = new Suit();

export default index;
