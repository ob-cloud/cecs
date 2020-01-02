# 校园节能监控系统 API

> `http://localhost:8201/common`

## ====== 栋 begin ======

### 获取栋列表

```js
access_token:b15f04ac-725f-4a21-85c2-6b8ad4c2d427
CMD:get_building
building:{"pageNo":1,"pageSize":10,"buildName":"B12"}
```

### 新增栋

```js
access_token:b15f04ac-725f-4a21-85c2-6b8ad4c2d427
CMD:add_building
building:{"buildName":"B222"}

```

### 更新栋

```js
access_token:b15f04ac-725f-4a21-85c2-6b8ad4c2d427
CMD:update_building
building:{"buildName":"B2232","id":29}
```

### 删除栋

```js
access_token:b15f04ac-725f-4a21-85c2-6b8ad4c2d427
CMD:delete_building
building:{"id":29}
```

### 获取所有栋

```js
access_token:ffda5a42-3d8a-4af4-9349-d0e40d6d6f74
CMD:get_select_building
```

## ====== 层 begin ======

### 获取层列表

```js
access_token:b15f04ac-725f-4a21-85c2-6b8ad4c2d427
CMD:get_floor
floor:{"pageNo":1,"pageSize":10,"floorName":"F2"}
```

### 新增层

```js
access_token:b15f04ac-725f-4a21-85c2-6b8ad4c2d427
CMD:add_floor
floor:{"floorName":"f222","buildingId":29}
```

### 更新层

```js
access_token:b15f04ac-725f-4a21-85c2-6b8ad4c2d427
CMD:update_floor
floor:{"floorName":"B2232","id":29}
```

### 删除层

```js
access_token:b15f04ac-725f-4a21-85c2-6b8ad4c2d427
CMD:delete_floor
floor:{"id":29}
```

## ====== 栋层 begin ======

### 获取栋层

```js
access_token:b15f04ac-725f-4a21-85c2-6b8ad4c2d427
CMD:get_building_floor
floor:{"buildingId":3}
```

## ====== 教室 begin ======

### 新增教室

```js
access_token:b15f04ac-725f-4a21-85c2-6b8ad4c2d427
CMD:add_room
room:{"roomName":"R1197","floorId":1}
```

### 更新教室

```js
access_token:b15f04ac-725f-4a21-85c2-6b8ad4c2d427
CMD:update_room
room:{"roomName":"R1197","floorId":1,"id":8}
```

### 删除教室

```js
access_token:b15f04ac-725f-4a21-85c2-6b8ad4c2d427
CMD:delete_room
room:{"id":8}
```

### 获取教室列表

```js
access_token:b15f04ac-725f-4a21-85c2-6b8ad4c2d427
CMD:get_room
room:{"pageNo":1,"pageSize":10,"roomName":"R119"}
```

### 绑定设备

```js
access_token:b15f04ac-725f-4a21-85c2-6b8ad4c2d427
CMD:bind_room_device
device:{"roomId":1,"deviceId":7790,"deviceSerialId":"faad52a001","deviceType":"04","deviceChildType":"17"}
```

### 教室设备列表

```js
access_token:b15f04ac-725f-4a21-85c2-6b8ad4c2d427
CMD:get_room_device
device:{"roomId":1,"pageNo":1,"pageSize":10}
```

### 触发开关(deviceType:[1:开,2:关])

```js
access_token:562a05ee-904c-44ca-a3e1-c13f76b73e0e
CMD:tigger_room_device
device:{"buildingId":1,"roomId":1,"floorId":1,"deviceType":1}
```

### 解绑设备

```js
access_token:b15f04ac-725f-4a21-85c2-6b8ad4c2d427
CMD:unbind_room_device
device:{"roomId":1,"deviceId":7790,"deviceSerialId":"faad52a001"}
```

### 获取栋层房

```js
access_token:b15f04ac-725f-4a21-85c2-6b8ad4c2d427
CMD:get_building_floor_room
```

### 总开关状态

```js
access_token:b15f04ac-725f-4a21-85c2-6b8ad4c2d427
CMD:get_alltype
```

## ====== 角色 begin ======

### 新建角色

```js
access_token:562a05ee-904c-44ca-a3e1-c13f76b73e0e
CMD:add_smart_role
appkey:1932516B-53B8-4DE3-8DA2-2358F7FDDB56
appId:OB Smart-2.1.1(1.10.08.1)
role:{"roleName": "广田1","privilegeWeight": 12889030911,"parentPrivilegeWeight":15}
```

### 更新角色状态

```js
access_token:562a05ee-904c-44ca-a3e1-c13f76b73e0e
CMD:update_smart_role_status
role:{"roleId":1,"status":1}
```

### 更新角色

```js
access_token:562a05ee-904c-44ca-a3e1-c13f76b73e0e
CMD:update_smart_role
role:{"roleId":74,"roleName": "广田2","privilegeWeight": 89030,"parentPrivilegeWeight":5}
```

### 获取角色列表

```js
access_token:562a05ee-904c-44ca-a3e1-c13f76b73e0e
CMD:get_smart_role
role:{"status":1,"roleName":"家"}
```

### 删除角色

```js
access_token:562a05ee-904c-44ca-a3e1-c13f76b73e0e
CMD:delete_smart_role
role:{"roleId":74}
```

## ====== 权限 begin ======

### 权限列表

```js
access_token:562a05ee-904c-44ca-a3e1-c13f76b73e0e
CMD:get_smart_privilege
```

## ====== 日志 begin ======

### 日志列表

```js
access_token:07a2d6c3-12a9-4e59-aca7-c80729835f6d
CMD:get_sys_log
log:{"sysType":"用户管理","sysDesc":"更新角色","operator":"13828486833"}
```

## ====== 用户 begin ======

### 新增用户

```js
access_token:07a2d6c3-12a9-4e59-aca7-c80729835f6d
CMD:add_smart_user
user:{"userName":"管理员","mobile":"13022222222","roleId":77,"password":"10abb24be0f8389b954740ae40d42b8c","parentId":630}
```

### 更新用户

```js
access_token:07a2d6c3-12a9-4e59-aca7-c80729835f6d
CMD:update_smart_user
user:{"userName":"管理员","mobile":"13022222222","roleId":77,"password":"10abb24be0f8389b954740ae40d42b8c","parentId":630,"userId":67}
```

### 删除用户

```js
access_token:07a2d6c3-12a9-4e59-aca7-c80729835f6d
CMD:delete_smart_user
user:{"userName":"管理员","mobile":"13022222222","roleId":77,"password":"10abb24be0f8389b954740ae40d42b8c","parentId":630,"userId":67}
```

### 获取用户列表

```js
access_token:07a2d6c3-12a9-4e59-aca7-c80729835f6d
CMD:get_smart_user
user:{"userName":"管理员","mobile":"13022222222","pageNo":1,"pageSize":10}
```

### 获取用户权限

```js
access_token:07a2d6c3-12a9-4e59-aca7-c80729835f6d
CMD:get_user_privilege
```

### 重置登录账号面

```js
access_token:fd3d053e-09f9-4465-9a22-867b91ae1a80
CMD:reset_smarthome_pwd
pwd:{"oldPwd":"297297c35d079df661902fd4fc8d0777","newPwd":"297297c35d079df661902fd4fc8d0777","confirmPwd":"297297c35d079df661902fd4fc8d0777"}
```

### 重置子账号密码

```js
access_token:fd3d053e-09f9-4465-9a22-867b91ae1a80
CMD:reset_subuser_pwd
pwd:{"newPwd":"297297c35d079df661902fd4fc8d0777","userId":76}
```

## ====== 设备 begin ======

### web端设备可选列表

```js
access_token:07a2d6c3-12a9-4e59-aca7-c80729835f6d
CMD:get_building_devices
appkey:1932516B-53B8-4DE3-8DA2-2358F7FDDB56
appId:OB Smart-2.1.1(1.10.08.1)
user:{"pageNo":1,"pageSize":10}
```

### 场景设备列表

```js
access_token:07a2d6c3-12a9-4e59-aca7-c80729835f6d
CMD:get_scene_devices
appkey:1932516B-53B8-4DE3-8DA2-2358F7FDDB56
appId:OB Smart-2.1.1(1.10.08.1)
```

### oboxdevice设备列表

```js
CMD:get_obox_device
oboxdevice:{"pageNo":1,"pageSize":10,"obox_serial_id":"8394000000","serialId":"023ebba201"}
```

### obox列表

```js
CMD:get_obox
obox:{"pageNo":1,"pageSize":10,"obox_serial_id":"8394000000","obox_name":"98","obox_status":1}
```

### 红外列表

```js
CMD:get_wifi
wifi:{"pageNo":1,"pageSize":10,"deviceId":"0ee25c3a7d","online":1,"name":"IR"}
```

### obox下拉列表

```js
CMD:get_allobox
```

## ====== 地图 begin ======

### 新增地图描点

```js
access_token:07a2d6c3-12a9-4e59-aca7-c80729835f6d
CMD:add_map_point
appkey:1932516B-53B8-4DE3-8DA2-2358F7FDDB56
point:{"roomId":2,"x":121.23,"y":121.36}
```

### 删除地图描点

```js
access_token:07a2d6c3-12a9-4e59-aca7-c80729835f6d
CMD:delete_map_point
appkey:1932516B-53B8-4DE3-8DA2-2358F7FDDB56
point:{"id":2}
```

### 获取地图描点

```js
access_token:07a2d6c3-12a9-4e59-aca7-c80729835f6d
CMD:get_map_point
appkey:1932516B-53B8-4DE3-8DA2-2358F7FDDB56
```

### 上传地图

```js
/image/uploadSchoolMap
access_token:6fd0e786-7b77-4e3f-96bb-b22db0ab8270
```

### 获取地图url

```js
access_token:07a2d6c3-12a9-4e59-aca7-c80729835f6d
CMD:get_map_info
appkey:1932516B-53B8-4DE3-8DA2-2358F7FDDB56
```

## ====== 场景 begin ======

### 场景列表

```js
CMD:get_smart_scene
scene:{"pageNo":1,"pageSize":10,"buildingId":11,"floorId":31,"roomId":37}
```

### 创建场景

```js
CMD:set_smart_scene
scene:{"scene_type":"00","scene_status":"01","scene_number":0,"scene_name":"dsdf","scene_group":"00","msg_alter":0,"loaction":{"buildingId":11,"floorId":31,"roomId":37},"actions":[{"node_type":"00","device_child_type":"17","device_type":"04","device_name":"8","serialId":"083ebba201","obox_serial_id":"8394000000","state":"00000000000000","addr":"07","action_time":0,"action":"15000000000002"}],"conditions":[[{"condition":"000813b06111a00","condition_type":"00"},{"condition":"4a0400000000","condition_type":"01","addr":"03","conditionID":"Socket1","device_child_type":"53","device_type":"04","obox_serial_id":"d0ed1ea281","serialId":"07a130af00"}],[],[]]}
```

### 场景详情

```js
CMD:
get_smart_single_scene
scene_number: 1
access_token: ae97ecfc-2d55-4333-aae2-480459b246a9
```
