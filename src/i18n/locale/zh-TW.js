import zhTWLocale from 'element-ui/lib/locale/lang/zh-TW'
export default {
  message: {
    refresh: '刷新',
    edit: '編輯',
    create: '添加',
    delete: '刪除',
    cancel: '取消',
    confirm: '確認',
    close: '關閉',
    fail: '失敗',
    success: '成功',
    exception: '服務異常',
    tips: '確認提示',
    upload: '上傳配置圖',
    uploading: '圖片上傳中...',
    uploadFail: '圖片上傳失敗，請重新上傳',
    search: '查詢',
    power: '電源',
    switchControl: '開關總閘',
    prev: '上一屏',
    next: '下一屏',
    building: '棟',
    floor: '層',
    room: '房',
    action: '操作',
    actionFail: '操作失敗',
    placeholder: '請{TYPE, select, input{輸入} choose{選擇} other{輸入}}{PLACEHOLDER, select, build{樓棟} floor{樓層} room{房間} other{}}',
    rules: '{RULE, select, build{樓棟} floor{樓層} room{房間} other{}} 不能為空',
    status: '{STATUS, select, open{打開} close{關閉} online{在線} offline{離線} on{開} off{關} other{}}',
    switchStatus: '{SWITCH, select, label{開關} open{打開} close{關閉} other{}}',
    image: '{IMAGE, select, pixel{請上傳規格為1080x72的圖片} type{圖片格式僅支持jpg/jpeg/png} other{}}',
    device: '{DEVICE_TEXT, select, temperature{溫度} humidifier{濕度} switch{開關} humitemp{溫濕度} Infrared{红外转发} other{}}'
  },
  smart: {
    roommodule: '房間管理',
    map: {
      title: '地圖',
      message: '{MESSAGE, select, delRoom{刪除房間} setLocation{位置設置中...} setLocSuccess{設置成功} roomExist{該房間已存在} delLocAction{確認刪除節點？} delLoc{位置刪除中...} other{}}'
    },
    room: {
      title: '房間',
      device: '房間設備',
      label: '{LABEL, select, build{樓棟} floor{樓層} room{房間} other{}}名稱',
      dialogTitle: '{TITLE, select, device{房間設備列表} scene{房間場景列表} edit{房間編輯} create{創建房間} other{提示框}}',
      message: '{MESSAGE, select, fail{房间获取失败} err{服务出错} switchConfirm{所有房間開關} loading{教室開關...} switchFail{開關操作失敗} rmRoomConfirm{確認刪除房間？} other{}}',
    },
    building: {
      title: '樓棟',
      dialogTitle: '{TITLE, select, edit{編輯樓棟} create{創建樓棟} other{提示框}}',
      message: '{MESSAGE, select, switchConfirm{所有樓棟開關} loading{教室開關...} switchFail{開關操作失敗} rmRoomConfirm{確認刪除樓棟？} other{}}',
    },
    floor: {
      title: '樓層',
      dialogTitle: '{TITLE, select, edit{編輯樓棟} create{創建樓棟} other{提示框}}',
      message: '{MESSAGE, select, switchConfirm{所有樓層開關} loading{教室開關...} switchFail{開關操作失敗} rmRoomConfirm{確認刪除樓層？} other{}}',
    },
    devicemodule: '設備管理',
    obox: {
      title: 'OBOX設備',
      search: '{FIELD, select, serial{設備序列號} devices{所有設備} type{設備類型} name{設備名稱} other{}}',
      tableField: '{FIELD, select, serial{設備序列號} name{設備名稱} status{設備狀態} type{設備類型} subtype{子設備類型} version{設備版本} action{操作} other{}}',
      slide: '{FIELD, select, panel{三鍵開關控制面板} humidifier{溫濕度} other{}}',
      placeholder: '{FIELD, select, lamp{燈開關} other{}}',
    },
    wifi: {
      title: 'WIFI設備'
    },
    gateway: {
      title: '網關管理'
    },
    scenemodule: '場景管理',
    usermodule: '用戶管理',
    logmodule: '日誌管理'
  },
  ...zhTWLocale
}
