/**
 * 设备
 */
var DeviceHolder = (function(){

// led
var led = {
    TYPE: '01',
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
    '0133': '风扇灯',
}

var ledStatus = {
    '00': '关',
    '01': '开',
    '43': '微弱',
    '86': '弱光',
    '129': '亮',
    '172': '较亮',
    '215': '非常亮',
    '254': '最大亮度'
}

// 电饭煲
var cooker = {
    '02': '智能电饭煲'
}

// 加湿器
var humidifier = {
    '03': '智能加湿器'
}

// 插座开关
var socketSwitch = {
    TYPE: '04',
    '04': '插座/开关',
    ONE_WAY_SOCKET: '01',
    TOUCH_SWITCH: '03',
    TWO_WAY_SOCKET: '12',
    THREE_WAY_SOCKET: '13',
    FOUR_WAY_SOCKET: '14',
    '0401': '插座',
    '0402': '面板',
    '0403': '触摸开关',
    '0412': '智能插座',
    '0413': '智能插座',
    '0414': '智能插座',

    ONE_WAY_SWITCH: '21',
    TWO_WAY_SWITCH: '22',
    THREE_WAY_SWITCH: '23',
    FOUR_WAY_SWITCH: '24',
    FIVE_WAY_SWITCH: '25',
    SIX_WAY_SWITCH: '26',
    EIGHT_WAY_SWITCH: '28',
    '0421': '普通触摸开关',
    '0422': '普通触摸开关',
    '0423': '普通触摸开关',
    '0424': '普通触摸开关',
    '0425': '普通触摸开关',
    '0426': '普通触摸开关',
    '0427': '普通触摸开关',
    '0428': '普通触摸开关',

    ONE_WAY_BOARD: '31',
    TWO_WAY_BOARD: '32',
    THREE_WAY_BOARD: '33',
    SIX_WAY_BOARD: '35',
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
}

var socketSwitchStatus = {
    '00': '关',
    '01': '开',
    '10': '置反',
    '11': '保持不变'
}

// 智能开、关类设备
var openAndCloseDevice = {
    '05': "",
    "0501": "窗帘",
    "0502": "投影仪幕布"
}

var fansDevice = {
    '06': '智能风扇'
}

var airCleaner = {
    '07': '智能空气净化器'
}

var TV = {
    '08': '兼容型智能电视'
}

var gateway = {
    '10': '网关',
    '1001': '通用版本',
    '1002': '阿里版本'
}

// 传感器
var sensors = {
    TYPE: '11',
    ALS: '01',
    WATER: '02',
    RADAR: '03',
    CO: '04',
    ENV: '05',
    BODY: '06',
    AIR: '07',
    ELECTRIC: '08',
    VIRTUAL_RADAR: '09',
    LIGHT: '10',
    HUMIDIFIER: '11',
    SMOKE: '12',
    WAVE: '13',
    RADAR_SENSE: '14',
    CARD_SENSE: '15',
    ENV_SENSE: '16',
    INDUCTION: '17',
    DC: '18',
    AC: '19',
    PM: '20',
    GATE: '21',
    RADAR_LIGHT: '22',

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
    "1122": "雷达灯",
}

// AC 红外
var sensorsStatus = {
    '00': '无人',
    '01': '有人'
}

$.extend(sensorsStatus, {
    'fe': '通电导通',
    'fd': '断电',
    'ff': '首次上电'
})
// var sensorStatusMap = {
//     acStatus: sensorsStatus,
//     cardSensorStatus: {
//         'fe': '通电导通',
//         'fd': '断电',
//         'ff': '首次上电'
//     }
// }

var meterReading = {
    '12': '智能抄表器',
    '1201': '智能抄表器'
}

var wireControlPanel = {
    '13': '线控面板',
    '1301': '空调线控器'
}

var transponder = {
    '14': '红外转发器',
    '1401': '蓝牙',
    '1402': 'wifi',
    '1403': '红外线控面板'
}

var remoteControl = {
    '15': '遥控设备',
    '1501': '手持单向遥控器'
}

var autoMoving = {
    '16': '智能自行设备',
    '1601': '四旋翼飞行器',
    '1602': '机械车'
}

// 门锁
var doorLock = {
    TYPE: '21',
    "21": "锁",
    "2101": "亚太天能智能门锁",
    "2102": "亿万家智能门锁",
    "2103": "OB智能门锁",
    "2104": "OB酒店门锁",
}

var doorLockStatus = {
    '00': '指纹开锁',
    '01': '密码开锁',
    '02': '卡开锁',
    '03': '钥匙开锁',
    '04': '遥控开锁',
    '05': '临时用户开锁',
    '-1': '关闭'
}
var remoteControlLamp = {
    '22': '遥控灯',
    '2201': '遥控灯'
}

// obox
var obox = {
    TYPE: '10',
    '10': 'obox',
    '1010': 'obox'
}

var oboxStatus = {
    '0': '离线',
    '1': '在线'
}




var devicesType = {}
$.extend(devicesType, led, cooker, humidifier, socketSwitch, 
    openAndCloseDevice, sensors, doorLock, obox, fansDevice, airCleaner, TV, gateway,
    meterReading, wireControlPanel, transponder, remoteControl, autoMoving, remoteControlLamp)

var devicesTypeMap = {
    led: led,
    cooker: cooker,
    humidifier: humidifier,
    socketSwitch: socketSwitch,
    openAndCloseDevice: openAndCloseDevice,
    sensors: sensors,
    doorLock: doorLock,
    obox: obox,
    fansDevice: fansDevice,
    airCleaner: airCleaner,
    TV: TV,
    gateway: gateway,
    meterReading: meterReading,
    wireControlPanel: wireControlPanel,
    transponder: transponder,
    remoteControl: remoteControl,
    autoMoving: autoMoving,
    remoteControlLamp: remoteControlLamp
}

// 设备状态
var devicesStatus = {
    ledStatus: ledStatus,
    socketSwitchStatus: socketSwitchStatus,
    sensorsStatus: sensorsStatus,
    doorLockStatus: doorLockStatus,
    oboxStatus: oboxStatus
}

/**
 * 进制转换
 * @param {String} number 
 * @param {Number} from 
 */
function BinaryConverter (number, from) {
    return parseInt(number, +from).toString(2)
}

function OctalConverter (number, from) {
    var radix = Converter(number, from, 8)
    return +radix < 8 ? '0' + radix : radix
}

function DecimalConverter (number, from) {
    var radix = Converter(number, from, 10)
    return +radix < 10 ? '0' + radix : radix
}

function HexDecimalConverter (number, from) {
    var radix = Converter(number, from, 16)
    return +radix < 16 ? '0' + radix : radix
}

function Converter (number, from, to) {
    return parseInt(number, +from).toString(+to)
}

/**
 * 仅根据 DeviceType 获取设备描述信息
 * @param {String} deviceType 
 */
function getDescriptorByDeviceTypeOnly (deviceType) {
    return devicesType[DecimalConverter(deviceType, 16, 10)]
}

/**
 * 根据设备类型及其子类型获取描述信息
 * @param {String} deviceType 
 * @param {String} deviceSubType 
 */
function getDescriptorByDeviceType (deviceType, deviceSubType) {
    var deviceTypeStr = DecimalConverter(deviceType, 16, 10),
        deviceSubTypeStr = DecimalConverter(deviceSubType, 16, 10);
    return devicesType[deviceTypeStr + deviceSubTypeStr]
}

function parseBinaryString2Array (bianary) {
    var binaryCode = BinaryConverter(bianary, 16),
    binaryArray = [];

    binaryCode = binaryCode.length % 2 ? '0' + binaryCode : binaryCode
    for (var i = 0; i <= binaryCode.length; i+2) {
        binaryArray.push(binaryCode.slice(i, i + 2))
    }
    return binaryArray
}

function getBinaryStatusDescriptor (statusMap, binary) {
    var binaryCode = BinaryConverter(binary, 16),
        descriptor = '';

    binaryCode = binaryCode.length % 2 ? '0' + binaryCode : binaryCode
    for (var i = 0; i <= binaryCode.length; i+2) {
        descriptor += statusMap[binaryCode.slice(i, i + 2)] + '/'
    }
    return descriptor.slice(0, -1)
}

/**
 * 根据状态码获取状态描述
 * @param {String} status 
 */
function getStatusDescriptor (status, deviceType, deviceSubType) {
    if (TypeLinter.isLED(deviceType, deviceSubType)) {
        return StatusDescriptor.getLedStatusDescriptor(status)
    }
    if (TypeLinter.isCooker(deviceType, deviceSubType)) {
        return StatusDescriptor.getCookerDescriptor(status)
    }
    if (TypeLinter.isHumidifier(deviceType, deviceSubType)) {
        return StatusDescriptor.getHumidifierDescriptor(status)
    }
    if (TypeLinter.isSocketSwitch(deviceType, deviceSubType)) {
        return StatusDescriptor.getSocketSwitchStatusDescriptor(status, deviceSubType)
    }
    if (TypeLinter.isOpenAndCloseDevice(deviceType, deviceSubType)) {
        return StatusDescriptor.getOpenAndCloseDeviceDescriptor(status)
    }
    if (TypeLinter.isSensors(deviceType, deviceSubType)) {
        return StatusDescriptor.getSensorsStatusDescriptor(status, deviceSubType)
    }
    if (TypeLinter.isDoorLock(deviceType, deviceSubType)) {
        return StatusDescriptor.getLockStatusDescriptor(status)
    }
    if (TypeLinter.isOBox(deviceType, deviceSubType)) {
        return StatusDescriptor.getOBoxStatusDescriptor(status)
    }
    if (TypeLinter.isFansDevice(deviceType, deviceSubType)) {
        return StatusDescriptor.getFansDeviceDescriptor(status)
    }
    if (TypeLinter.isAirCleaner(deviceType, deviceSubType)) {
        return StatusDescriptor.getAirCleanerDescriptor(status)
    }
    if (TypeLinter.isTV(deviceType, deviceSubType)) {
        return StatusDescriptor.getTVDescriptor(status)
    }
    if (TypeLinter.isGateWay(deviceType, deviceSubType)) {
        return StatusDescriptor.getGateWayDescriptor(status)
    }
    if (TypeLinter.isMeterReading(deviceType, deviceSubType)) {
        return StatusDescriptor.getMeterReadingDecriptor(status)
    }
    if (TypeLinter.isWireControlPanel(deviceType, deviceSubType)) {
        return StatusDescriptor.getWireControlPanelDescriptor(status)
    }
    if (TypeLinter.isTransponder(deviceType, deviceSubType)) {
        return StatusDescriptor.getTransponderDescriptor(status)
    }
    if (TypeLinter.isRemoteControl(deviceType, deviceSubType)) {
        return StatusDescriptor.getRemoteControlDescriptor(status)
    }
    if (TypeLinter.isAutoMoving(deviceType, deviceSubType)) {
        return StatusDescriptor.getAutoMovingDescriptor(status)
    }
    if (TypeLinter.isRemoteControlLamp(deviceType, deviceSubType)) {
        return StatusDescriptor.getRemoteControlLampDescriptor(status)
    }
}

// 状态描述器
var StatusDescriptor = {
    /**
     * 获取插座开关状态
     * @param {String} status 
     */
    getSocketSwitchStatusDescriptor: function (status, deviceSubType) {
        if (!deviceSubType) return devicesStatus.socketSwitchStatus[status.slice(6, 8)]
        
        if (TypeLinter.isWaySocketSwitch(deviceSubType) || TypeLinter.isNormalSocketSwitch(deviceSubType)) {
            return getBinaryStatusDescriptor(devicesStatus.socketSwitchStatus, status.slice(0, 2))
        }

        if (TypeLinter.isSceneSocketSwitch(deviceSubType)) {
            return getBinaryStatusDescriptor(devicesStatus.socketSwitchStatus, status.slice(6, 8))
        }
        
        // if (TypeLinter.isNormalSocketSwitch(deviceSubType)) {
        //     return getBinaryStatusDescriptor(devicesStatus.socketSwitchStatus, status.slice(6, 8))
        // }
    },
    /**
     * 获取LED灯状态
     * @param {String} status 
     */
    getLedStatusDescriptor: function (status) {
        var light = BinaryConverter(status.slice(0, 2), 16, 2)
        if (+light > 1) {//落地灯
            var code = light < 43 ? '43' :
                light > 43 && light < 86 ? '86' :
                light > 86 && light < 129 ? '129' :
                light > 129 && light < 172 ? '172' :
                    light < 172 && light > 215 ? '215' : '254'

            return devicesStatus.ledStatus[code]
        } else {
            return devicesStatus.ledStatus[status.slice(0, 2)]
        }
        
    },
    /**
     * 获取传感器状态
     * @param {String} status 
     */
    getSensorsStatusDescriptor: function (status, deviceSubType) {
        if (!deviceSubType) return devicesStatus.sensorsStatus[status.slice(8, 10)]

        if (TypeLinter.isACSensor(deviceSubType)) {
            return devicesStatus.sensorsStatus[status.slice(8, 10)]
        }
        if (TypeLinter.isCardSensor(deviceSubType)) {
            return devicesStatus.sensorsStatus[status.slice(0, 2)]
        }
    },
    /**
     * 获取门锁状态
     * @param {String} status 
     */
    getLockStatusDescriptor: function (status) {
        var cmd = status.slice(2,4)
        if (cmd === 'c3') {
            var code = DecimalConverter(status.slice(10, 12), 16, 10)
            return devicesStatus.doorLockStatus[code]
        } else if (cmd === 'cd') {
            return devicesStatus.doorLockStatus['2']
        } else {
            return devicesStatus.doorLockStatus['-1']
        }
    },
    /**
     * 获取OBOX状态
     * @param {String} status 
     */
    getOBoxStatusDescriptor: function (status) {
        return devicesStatus.oboxStatus[status.slice(0, 1)]
    },
    /**
     * 获取电饭煲状态
     * @param {String} status 
     */
    getCookerDescriptor: function (status) {

    },
    /**
     * 获取加湿器状态
     * @param {String} status 
     */
    getHumidifierDescriptor: function (status) {

    },
    /**
     * 获取可开关类设备状态
     * @param {String} status 
     */
    getOpenAndCloseDeviceDescriptor: function (status) {

    },
    getFansDeviceDescriptor: function (status) {

    },
    getAirCleanerDescriptor: function (status) {

    },
    getTVDescriptor: function (status) {

    },
    getGateWayDescriptor: function (status) {

    },
    getMeterReadingDecriptor: function (status) {

    },
    getWireControlPanelDescriptor: function (status) {

    },
    getTransponderDescriptor: function (status) {

    },
    getRemoteControlDescriptor: function (status) {

    },
    getAutoMovingDescriptor: function (status) {

    },
    getRemoteControlLampDescriptor: function (status) {

    }
}


// 类型检测
var TypeLinter = {
    /**
     * 是否led
     * @param {*} deviceType 
     * @param {*} deviceSubType 
     */
    isLED: function (deviceType, deviceSubType) {
        return this.handler(led, deviceType, deviceSubType)
    },
    /**
     * 是否电饭煲
     * @param {String} deviceType 
     * @param {String} deviceSubType 
     */
    isCooker: function (deviceType, deviceSubType) {
        return this.handler(cooker, deviceType, deviceSubType)
    },
    /**
     * s是否加湿器
     * @param {String} deviceType 
     * @param {String} deviceSubType 
     */
    isHumidifier: function (deviceType, deviceSubType) {
        return this.handler(humidifier, deviceType, deviceSubType)
    },
    /**
     * 判断是否插座开关
     * @param {String} deviceType 
     * @param {String} deviceSubType 
     */
    isSocketSwitch: function (deviceType, deviceSubType) {
        return this.handler(socketSwitch, deviceType, deviceSubType)
    },
    isWaySocketSwitch: function (deviceSubType) {
        return [socketSwitch.ONE_WAY_SWITCH, socketSwitch.TWO_WAY_SWITCH, socketSwitch.THREE_WAY_SWITCH,
        socketSwitch.FOUR_WAY_SWITCH, socketSwitch.FIVE_WAY_SWITCH, socketSwitch.SIX_WAY_SWITCH,
        socketSwitch.EIGHT_WAY_SWITCH].indexOf(DecimalConverter(deviceSubType, 16, 10))
    },
    isSceneSocketSwitch: function (deviceSubType) {
        return [socketSwitch.ONE_WAY_BOARD, socketSwitch.TWO_WAY_BOARD, 
            socketSwitch.THREE_WAY_BOARD, socketSwitch.SIX_WAY_BOARDH].indexOf(DecimalConverter(deviceSubType, 16, 10))
    },
    isNormalSocketSwitch: function (deviceSubType) {
        return [socketSwitch.ONE_WAY_SOCKET, socketSwitch.TOUCH_SWITCH, 
            socketSwitch.TWO_WAY_SOCKET, socketSwitch.THREE_WAY_SOCKET, 
            socketSwitch.FOUR_WAY_SOCKET].indexOf(DecimalConverter(deviceSubType, 16, 10))
    },

    /**
     * 是否开关类设备
     * @param {String} deviceType 
     * @param {String} deviceSubType 
     */
    isOpenAndCloseDevice: function (deviceType, deviceSubType) {
        return this.handler(openAndCloseDevice, deviceType, deviceSubType)
    },
    /**
     * 是否传感器
     * @param {String} deviceType 
     * @param {String} deviceSubType 
     */
    isSensors: function (deviceType, deviceSubType) {
        return this.handler(sensors, deviceType, deviceSubType)
    },
    isCardSensor: function (deviceSubType) {
        return sensors.CARD_SENSE === DecimalConverter(deviceSubType, 16, 10)
    },
    isACSensor: function (deviceSubType) {
        return sensors.AC === DecimalConverter(deviceSubType, 16, 10)
    },
    isACSensor: function (deviceSubType) {
        return this.handler(sensors, sensors.TYPE, deviceSubType)
    },
    /**
     * 是否门锁
     * @param {String} deviceType 
     * @param {String} deviceSubType 
     */
    isDoorLock: function (deviceType, deviceSubType) {
        return this.handler(doorLock, deviceType, deviceSubType)
    },
    /**
     * 是否OBOX设备
     * @param {String} deviceType 
     * @param {String} deviceSubType 
     */
    isOBox: function (deviceType, deviceSubType) {
        return this.handler(obox, deviceType, deviceSubType)
    },
    isFansDevice: function (deviceType, deviceSubType) {
        return this.handler(fansDevice, deviceType, deviceSubType)
    },
    isAirCleaner: function (deviceType, deviceSubType) {
        return this.handler(airCleaner, deviceType, deviceSubType)
    },
    isTV: function (deviceType, deviceSubType) {
        return this.handler(TV, deviceType, deviceSubType)
    },
    isGateWay: function (deviceType, deviceSubType) {
        return this.handler(gateway, deviceType, deviceSubType)
    },
    isMeterReading: function (deviceType, deviceSubType) {
        return this.handler(meterReading, deviceType, deviceSubType) 
    },
    isWireControlPanel: function (deviceType, deviceSubType) {
        return this.handler(wireControlPanel, deviceType, deviceSubType) 
    },
    isTransponder: function (deviceType, deviceSubType) {
        return this.handler(transponder, deviceType, deviceSubType) 
    },
    isRemoteControl: function (deviceType, deviceSubType) {
        return this.handler(remoteControl, deviceType, deviceSubType) 
    },
    isAutoMoving: function (deviceType, deviceSubType) {
        return this.handler(autoMoving, deviceType, deviceSubType) 
    },
    isRemoteControlLamp: function (deviceType, deviceSubType) {
        return this.handler(remoteControlLamp, deviceType, deviceSubType) 
    },
    handler: function (typeMap, deviceType, deviceSubType) {
        if (!typeMap) return false
        if (!deviceSubType) {
            return !!typeMap[DecimalConverter(deviceType, 16, 10)]
        }
        var deviceStr = DecimalConverter(deviceType, 16, 10) + DecimalConverter(deviceSubType, 16, 10)
        return !!typeMap[deviceStr]
    }
}


return {
    devicesType: devicesType,
    devicesTypeMap: devicesTypeMap,

    devicesStatus: devicesStatus,

    TypeLinter: TypeLinter,

    StatusDescriptor: StatusDescriptor,

    getDescriptorByDeviceType: getDescriptorByDeviceType,
    getDescriptorByDeviceTypeOnly: getDescriptorByDeviceTypeOnly,
    getStatusDescriptor: getStatusDescriptor
}
})()
