import zhTWLocale from 'element-ui/lib/locale/lang/zh-TW'
export default {
  system: {
    title: '校園節能中控系統',
    reset: '{FIELD, select, title{重設密碼} oldpwd{舊密碼} newpwd{新密碼} confirm{確認新密碼} resetsuccess{重置成功，即將退出重新登錄} fail{重置失敗} other{}}',
    rules: '{FIELD, select, length{密碼長度不能小於6位} erroldpwd{舊密碼不正確} empty{密碼不能為空} errconfirm{兩次輸入密碼不一致} other{}}',
    resetpwd: '重置密碼',
    logout: '退出登錄',
    login: '登錄',
    logintext: '{FIELD, select, account{手機號} pwd{密碼} erraccount{請輸入正確的手機號} invalidMobile{手機號碼有誤} loginfail{登錄失敗，賬號或密碼錯誤} other{}}',
    route: '{FIELD, select, devicemgr{設備管理} scenemgr{場景管理} roommgr{教室管理} usrmgr{用戶管理} logmgr{日誌管理} other{}}',
    validator: '{FIELD, select, name{名稱應為英文字母、數字或下劃線組成的字符串} mobile{手機號碼格式有誤} other{}}',
    devtype: '{FIELD, select, Sensor{傳感器} HumidSensors{溫濕度傳感器} Switcher{插座開關} 3KeySwitch{三路開關} Ifrate{紅外轉發器} other{}}',
    cron: '{FIELD, select, second{秒} minute{分} hour{時} day{日} month{月} week{週} weekday{星期} year{年} perSecond{每秒} perMinute{每分} perHour{每時} perDay{每日} perMonth{每月} perWeek{每週} perYear{每年} period{週期} pointAt{指定} noPointAt{不指定} dateWeekPointAt{日期與星期不可以同時為“不指定”} dateWeekNoPointAt{日期與星期必須有一個為“不指定”} from{從} to{至} per{每}  sun{日} mon{一} tue{二} wed{三} thu{四} fri{五} sat{六} other{}}',
  },
  message: {
    refresh: '刷新',
    edit: '編輯',
    create: '添加',
    delete: '刪除',
    reset: '重置密碼',
    cancel: '取消',
    confirm: '確認',
    close: '關閉',
    fail: '失敗',
    rename: '重命名',
    success: '成功',
    exception: '服務異常',
    tips: '確認提示',
    exports: '導出',
    upload: '上傳配置圖',
    uploading: '圖片上傳中...',
    uploadFail: '圖片上傳失敗，請重新上傳',
    search: '查詢',
    power: '電源',
    bind: '綁定',
    unbind: '解綁',
    binddev: '綁定設備',
    unbinddev: '解綁設備',
    switchControl: '開關總閘',
    prev: '上一屏',
    next: '下一屏',
    building: '棟',
    floor: '層',
    room: '室',
    none: '無',
    noData: '暫無資料',
    action: '操作',
    noAction: '無操作',
    actionFail: '操作失敗',
    actionSuccess: '操作成功',
    placeholder: '請{TYPE, select, input{輸入} choose{選擇} other{輸入}}{PLACEHOLDER, select, build{樓棟} floor{樓層} room{教室} deviceName{設備名稱} deviceType{設備類型} other{}}',
    rules: '{RULE, select, build{樓棟} floor{樓層} room{教室} user{用戶名} phone{手機號} pwd{密碼} role{角色} roleName{角色名稱} deviceName{設備名稱} other{}} 不能為空',
    status: '{STATUS, select, open{打開} close{關閉} online{在線} offline{離線} on{開} off{關} noDev{無設備} other{}}',
    switchStatus: '{SWITCH, select, label{開關} open{打開} close{關閉} on{開} off{關} noDev{無設備} switchOn{開關 - 開} switchOff{開關 - 關} other{}}',
    image: '{IMAGE, select, pixel{請上傳規格為1080x720的圖片} type{圖片格式僅支持jpg/jpeg/png} other{}}',
    device: '{DEVICE_TEXT, select, temperature{溫度} humidifier{濕度} switch{開關} humitemp{溫濕度} humDev{溫濕度類型設備} Infrared{紅外轉發} other{}}'
  },
  smart: {
    roommodule: '教室管理',
    map: {
      title: '地圖',
      message: '{MESSAGE, select, delRoom{刪除教室} setLocation{位置設置中...} setLocSuccess{設置成功} roomExist{該教室已存在} delLocAction{確認刪除節點？} delLoc{位置刪除中...} other{}}'
    },
    room: {
      title: '教室',
      device: '教室設備',
      label: '{LABEL, select, build{樓棟} floor{樓層} room{教室} other{}}名稱',
      dialogTitle: '{TITLE, select, device{教室設備列表} scene{教室場景列表} edit{教室編輯} create{創建教室} other{提示框}}',
      message: '{MESSAGE, select, fail{教室獲取失敗} err{服務出錯} switchConfirm{所有教室開關} loading{教室開關...} switchFail{開關操作失敗} rmRoomConfirm{確認刪除教室？} fetchRoomDev{獲取教室設備} binding{設備綁定中...} unbinding{設備解綁中...} unbindConfirm{確認解綁設備？} other{}}',
      tableField: '{FIELD, select, option{選項} obxSerial{obox序列號} serial{設備序列號} name{設備名稱} status{設備狀態} type{設備類型} subtype{子設備類型} version{設備版本} action{操作} other{}}',
    },
    building: {
      title: '樓棟',
      dialogTitle: '{TITLE, select, edit{編輯樓棟} create{創建樓棟} other{提示框}}',
      message: '{MESSAGE, select, switchConfirm{樓棟開關} switchGlobConfirm{所有樓棟開關} loading{教室開關...} switchFail{開關操作失敗} rmRoomConfirm{確認刪除樓棟？} other{}}',
    },
    floor: {
      title: '樓層',
      dialogTitle: '{TITLE, select, edit{編輯樓層} create{創建樓層} other{提示框}}',
      message: '{MESSAGE, select, switchConfirm{樓層開關} switchGlobConfirm{所有樓棟開關} loading{教室開關...} switchFail{開關操作失敗} rmRoomConfirm{確認刪除樓層？} other{}}',
    },
    devicemodule: '設備管理',
    obox: {
      title: 'OBOX設備',
      search: '{FIELD, select, serial{設備序列號} devices{所有網關設備} type{設備類型} name{設備名稱} other{}}',
      tableField: '{FIELD, select, temperature{溫度} humidifier{濕度} date{時間} serial{設備序列號} name{設備名稱} status{設備狀態} type{設備類型} subtype{子設備類型} version{設備版本} action{操作} other{}}',
      slide: '{FIELD, select, panel{三鍵開關控制面板} humidifier{溫濕度} other{}}',
      placeholder: '{FIELD, select, lamp{開關} humidifier{溫濕度} other{}}',
      message: '{MESSAGE, select, powerswitch{電源開關已} direct{操作指令發送成功} fetchFail{設備獲取失敗} loading{設備刪除中...} delConfirm{確認刪除設備？} delDevice{設備刪除} setSuccess{設置成功} setFail{設置失敗} history{歷史數據} nowadays{今日數據} oboxoffline{OBOX離線或不存在} nobelong{沒有權限操作該設備} other{}}',
      ac: '{FIELD, select, temperature{溫度} humidifier{濕度} auto{自動} speed{風速} fans{風扇} weak{弱風} medium{中風} strong{強風} cold{製冷} hot{制熱} dehum{抽濕} supply{送風} mode{模式} switch{開關} type{設備類型} subtype{子設備類型} version{設備版本} action{操作} noKeyHandle{請進行按鍵設置} other{暫無資料}}'
    },
    wifi: {
      title: 'WIFI設備',
      search: '{FIELD, select, serial{設備序列號} status{所有狀態} type{設備類型} name{設備名稱} other{}}',
      tableField: '{FIELD, select, serial{設備序列號} name{設備名稱} status{設備狀態} type{設備類型} action{操作} other{}}',
      slide: '{FIELD, select, panel{紅外轉發控制面板} humidifier{溫濕度} other{}}',
      placeholder: '{FIELD, select, infrated{紅外控制} other{}}',
    },
    gateway: {
      title: '網關管理',
      search: '{FIELD, select, serial{序列號} status{全部狀態} name{名稱} other{}}',
      tableField: '{FIELD, select, serial{序列號} name{名稱} status{狀態} version{版本} action{操作} other{}}',
      message: '{MESSAGE, select, fetchFail{網關設備獲取失敗} loading{網關設備刪除中...} delConfirm{確認刪除網關？} delDevice{網關刪除} other{}}',
    },
    scenemodule: '場景管理',
    scene: {
      search: '{FIELD, select, build{全部樓棟} floor{全部樓層} room{全部教室} name{場景名稱} other{}}',
      action: '{FIELD, select, create{創建場景} excute{執行場景} edit{編輯場景} delete{刪除} other{}}',
      tableField: '{FIELD, select, name{場景名稱} build{樓棟} floor{樓層} room{教室} status{場景狀態} action{操作} other{}}',
      message: '{MESSAGE, select, fetchFail{場景獲取失敗} loading{場景刪除中...} delConfirm{確認刪除場景？} delDevice{場景刪除} update{場景狀態更新} excute{場景執行} excuting{場景執行中...} other{}}',
      create: '{FIELD, select, inputNameTip{輸入場景名稱} empty{場景名稱不能為空} locationEmpty{樓棟不能為空}  invalid{名稱應為英文字母、數字或下劃線组成的字符串} location{位置} deviceCon{設備條件} cons1{條件1} cons2{條件2} cons3{條件3} behavior{設備行為} actionTips{行為執行時間(單位秒)} devAction{配置設備動作} setDevAct{設備行為配置} conType{條件類型} conTip{一組最多三個條件} other{}}',
      condition: '{FIELD, select, timing{定時} timeCon{定時條件} date{日期} selDate{選擇日期} selTime{選擇時間} week{星期} chain{聯動} chainCon{聯動條件} selConTip{請選擇正確條件} setChainDevCon{請配置聯動條件} setActionBehavior{請補全設備行為} other{}}',
    },
    usermodule: '用戶管理',
    account: {
      title: '賬戶管理',
      search: '{FIELD, select, name{輸入用戶名} phone{輸入手機號碼} other{}}',
      form: '{FIELD, select, name{輸入用戶名} phone{輸入手機號碼} pwd{輸入密碼} role{請選擇角色} mobile{手機號} roleName{角色} other{}}',
      action: '{FIELD, select, create{添加賬戶} edit{編輯賬戶} other{}}',
      tableField: '{FIELD, select, name{用戶名} phone{手機號碼} pwd{密碼} roleName{角色名} action{操作} other{}}',
      message: '{MESSAGE, select, fetchFail{用戶獲取失敗} loading{賬戶刪除中...} delConfirm{確認刪除賬戶？} resetPwdConfirm{密碼將重置為 12345678} delDevice{賬戶刪除} other{}}',
    },
    role: {
      title: '角色管理',
      search: '{FIELD, select, name{輸入角色名} status{全部狀態} other{}}',
      form: '{FIELD, select, label{角色名稱} name{請輸入角色名稱} auth{角色權限} other{}}',
      action: '{FIELD, select, create{創建角色} edit{編輯角色} enable{啟動} disable{停用} other{}}',
      tableField: '{FIELD, select, serial{序號} name{角色名} status{狀態} action{操作} other{}}',
      message: '{MESSAGE, select, fetchFail{角色獲取失敗} loading{角色刪除中...} statusUpdate{狀態更新成功} delConfirm{確認刪除角色？} delDevice{角色刪除} other{}}',
    },
    logmodule: '日誌管理',
    logrecords: {
      title: '日誌記錄',
      search: '{FIELD, select, operator{執行人} description{輸入描述內容} type{日誌類型} device{設備管理} scene{場景管理} user{用戶管理} room{教室管理} other{}}',
      tableField: '{FIELD, select, serial{序號} type{類型} action{操作行為} datetime{操作時間} operator{執行人} other{}}',
      message: '{MESSAGE, select, fetchFail{日誌獲取失敗} other{}}',
    },
    exportrecords: {
      title: '導出日誌',
      search: '{FIELD, select, start{開始日期} end{結束日期} week{最近一周} month{最近一個月} months{最近三個月} other{}}',
      tableField: '{FIELD, select, serial{序號} name{文件名} daterange{日期區間} datetime{操作時間} operator{執行人} other{}}',
      message: '{MESSAGE, select, chooseDate{請選擇導出日期} other{}}',
    }
  },
  ...zhTWLocale
}
