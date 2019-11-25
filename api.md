# API

http://localhost:8201/common

// ====== 栋 begin ======

access_token:b15f04ac-725f-4a21-85c2-6b8ad4c2d427
CMD:get_building
appkey:1932516B-53B8-4DE3-8DA2-2358F7FDDB56
appId:OB Smart-2.1.1(1.10.08.1)
building:{"pageNo":1,"pageSize":10,"buildName":"B12"}

access_token:b15f04ac-725f-4a21-85c2-6b8ad4c2d427
CMD:add_building
appkey:1932516B-53B8-4DE3-8DA2-2358F7FDDB56
appId:OB Smart-2.1.1(1.10.08.1)
building:{"buildName":"B222"}

access_token:b15f04ac-725f-4a21-85c2-6b8ad4c2d427
CMD:update_building
appkey:1932516B-53B8-4DE3-8DA2-2358F7FDDB56
appId:OB Smart-2.1.1(1.10.08.1)
building:{"buildName":"B2232","id":29}

access_token:b15f04ac-725f-4a21-85c2-6b8ad4c2d427
CMD:delete_building
appkey:1932516B-53B8-4DE3-8DA2-2358F7FDDB56
appId:OB Smart-2.1.1(1.10.08.1)
building:{"id":29}

// ====== 栋 end ======


// ====== 层 begin ======

access_token:b15f04ac-725f-4a21-85c2-6b8ad4c2d427
CMD:get_floor
appkey:1932516B-53B8-4DE3-8DA2-2358F7FDDB56
appId:OB Smart-2.1.1(1.10.08.1)
floor:{"pageNo":1,"pageSize":10,"floorName":"F2"}

access_token:b15f04ac-725f-4a21-85c2-6b8ad4c2d427
CMD:add_floor
appkey:1932516B-53B8-4DE3-8DA2-2358F7FDDB56
appId:OB Smart-2.1.1(1.10.08.1)
floor:{"floorName":"f222","buildingId":29}

access_token:b15f04ac-725f-4a21-85c2-6b8ad4c2d427
CMD:update_floor
appkey:1932516B-53B8-4DE3-8DA2-2358F7FDDB56
appId:OB Smart-2.1.1(1.10.08.1)
floor:{"floorName":"B2232","id":29}

access_token:b15f04ac-725f-4a21-85c2-6b8ad4c2d427
CMD:delete_floor
appkey:1932516B-53B8-4DE3-8DA2-2358F7FDDB56
appId:OB Smart-2.1.1(1.10.08.1)
floor:{"id":29}

// ====== 层 end ======

// ====== 栋层 begin ======

access_token:b15f04ac-725f-4a21-85c2-6b8ad4c2d427
CMD:get_building_floor
appkey:1932516B-53B8-4DE3-8DA2-2358F7FDDB56
appId:OB Smart-2.1.1(1.10.08.1)
floor:{"buildingId":3}

// ====== 栋层 end ======

// ====== 房间 begin ======

access_token:b15f04ac-725f-4a21-85c2-6b8ad4c2d427
CMD:add_room
appkey:1932516B-53B8-4DE3-8DA2-2358F7FDDB56
appId:OB Smart-2.1.1(1.10.08.1)
room:{"roomName":"R1197","floorId":1}

access_token:b15f04ac-725f-4a21-85c2-6b8ad4c2d427
CMD:update_room
appkey:1932516B-53B8-4DE3-8DA2-2358F7FDDB56
appId:OB Smart-2.1.1(1.10.08.1)
room:{"roomName":"R1197","floorId":1,"id":8}

access_token:b15f04ac-725f-4a21-85c2-6b8ad4c2d427
CMD:delete_room
appkey:1932516B-53B8-4DE3-8DA2-2358F7FDDB56
appId:OB Smart-2.1.1(1.10.08.1)
room:{"id":8}

access_token:b15f04ac-725f-4a21-85c2-6b8ad4c2d427
CMD:get_room
appkey:1932516B-53B8-4DE3-8DA2-2358F7FDDB56
appId:OB Smart-2.1.1(1.10.08.1)
room:{"pageNo":1,"pageSize":10,"roomName":"R119"}

//绑定开关
access_token:b15f04ac-725f-4a21-85c2-6b8ad4c2d427
CMD:bind_room_device
appkey:1932516B-53B8-4DE3-8DA2-2358F7FDDB56
appId:OB Smart-2.1.1(1.10.08.1)
device:{"roomId":1,"deviceId":7790}

//触发开关(deviceType:[1:开,2:关])
access_token:562a05ee-904c-44ca-a3e1-c13f76b73e0e
CMD:tigger_room_device
appkey:1932516B-53B8-4DE3-8DA2-2358F7FDDB56
appId:OB Smart-2.1.1(1.10.08.1)
device:{"buildingId":1,"roomId":1,"floorId":1,"deviceType":1}

// ====== 房间 begin ======


// ====== 角色 begin ======

access_token:562a05ee-904c-44ca-a3e1-c13f76b73e0e
CMD:add_smart_role
appkey:1932516B-53B8-4DE3-8DA2-2358F7FDDB56
appId:OB Smart-2.1.1(1.10.08.1)
role:{"roleName": "广田1","privilegeWeight": 12889030911,"parentPrivilegeWeight":15}

access_token:562a05ee-904c-44ca-a3e1-c13f76b73e0e
CMD:update_smart_role_status
appkey:1932516B-53B8-4DE3-8DA2-2358F7FDDB56
appId:OB Smart-2.1.1(1.10.08.1)
role:{"roleId":1,"status":1}

access_token:562a05ee-904c-44ca-a3e1-c13f76b73e0e
CMD:update_smart_role
appkey:1932516B-53B8-4DE3-8DA2-2358F7FDDB56
appId:OB Smart-2.1.1(1.10.08.1)
role:{"roleId":74,"roleName": "广田2","privilegeWeight": 89030,"parentPrivilegeWeight":5}

access_token:562a05ee-904c-44ca-a3e1-c13f76b73e0e
CMD:update_smart_role
appkey:1932516B-53B8-4DE3-8DA2-2358F7FDDB56
appId:OB Smart-2.1.1(1.10.08.1)
role:{"roleId":74,"roleName": "广田2","privilegeWeight": 89030,"parentPrivilegeWeight":5}


access_token:562a05ee-904c-44ca-a3e1-c13f76b73e0e
CMD:get_smart_role
appkey:1932516B-53B8-4DE3-8DA2-2358F7FDDB56
appId:OB Smart-2.1.1(1.10.08.1)
role:{"status":1,"roleName":"家"}

access_token:562a05ee-904c-44ca-a3e1-c13f76b73e0e
CMD:delete_smart_role
appkey:1932516B-53B8-4DE3-8DA2-2358F7FDDB56
appId:OB Smart-2.1.1(1.10.08.1)
role:{"roleId":74}

// ====== 角色 end ======


// ====== 权限 begin ======

access_token:562a05ee-904c-44ca-a3e1-c13f76b73e0e
CMD:get_smart_privilege
appkey:1932516B-53B8-4DE3-8DA2-2358F7FDDB56
appId:OB Smart-2.1.1(1.10.08.1)

// ====== 权限 end ======


// ====== 日志 begin ======


access_token:07a2d6c3-12a9-4e59-aca7-c80729835f6d
CMD:get_sys_log
appkey:1932516B-53B8-4DE3-8DA2-2358F7FDDB56
appId:OB Smart-2.1.1(1.10.08.1)
log:{"sysType":"用户管理","sysDesc":"更新角色","operator":"13828486833"}

// ====== 日志 begin ======


// ====== 用户 begin ======


access_token:07a2d6c3-12a9-4e59-aca7-c80729835f6d
CMD:add_smart_user
appkey:1932516B-53B8-4DE3-8DA2-2358F7FDDB56
appId:OB Smart-2.1.1(1.10.08.1)
user:{"userName":"管理员","mobile":"13022222222","roleId":77,"password":"10abb24be0f8389b954740ae40d42b8c","parentId":630}


access_token:07a2d6c3-12a9-4e59-aca7-c80729835f6d
CMD:update_smart_user
appkey:1932516B-53B8-4DE3-8DA2-2358F7FDDB56
appId:OB Smart-2.1.1(1.10.08.1)
user:{"userName":"管理员","mobile":"13022222222","roleId":77,"password":"10abb24be0f8389b954740ae40d42b8c","parentId":630,"userId":67}

access_token:07a2d6c3-12a9-4e59-aca7-c80729835f6d
CMD:delete_smart_user
appkey:1932516B-53B8-4DE3-8DA2-2358F7FDDB56
appId:OB Smart-2.1.1(1.10.08.1)
user:{"userName":"管理员","mobile":"13022222222","roleId":77,"password":"10abb24be0f8389b954740ae40d42b8c","parentId":630,"userId":67}

access_token:07a2d6c3-12a9-4e59-aca7-c80729835f6d
CMD:get_smart_user
appkey:1932516B-53B8-4DE3-8DA2-2358F7FDDB56
appId:OB Smart-2.1.1(1.10.08.1)
user:{"userName":"管理员","mobile":"13022222222","pageNo":1,"pageSize":10}


// ====== 用户 begin ======
