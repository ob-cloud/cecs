import SceneAPI from '@/api/scene'
export default {
  data () {
    return {
      buildingList: [],
      floorList: [],
      roomList: [],
      sceneDeviceList: [],
      deviceTypeList: []
    }
  },
  methods: {
    getSceneDeviceList () {
      return new Promise(resolve => {
        SceneAPI.getSceneDeviceList().then(res => {
          if (res.status === 0) {
            this.sceneDeviceList = res.data.records
            this.buildingList = res.data.records
            resolve(this.buildingList)
          }
        })
      })
    },
    getBuildingList (sceneDeviceList) {

    },
    getFloorList (buildingId) {
      if (!buildingId) return
      const building = this.findBuildingById(buildingId)
      if (!building) return
      this.floorList = building.floors
    },
    getRoomList (floorId) {
      if (!floorId) return
      const floor = this.findFloorById(floorId)
      if (!floor) return
      this.roomList = floor.rooms
    },
    getDeviceTypeListByRoomId (roomId) {
      if (!roomId) return
      const room = this.findRoomById(roomId)
      if (!room) return
      this.deviceTypeList = room.devices
    },
    findBuildingById (id) {
      return this.buildingList.find(item => item.buildingId === id)
    },
    findFloorById (id) {
      return this.floorList.find(item => item.floorId === id)
    },
    findRoomById (id) {
      return this.roomList.find(item => item.roomId === id)
    },
  },
}
