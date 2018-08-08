// pages/indoor/indoor.js
const util = require('../../utils/util')
const ajax = require('../../utils/ajax')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        building: null, // 室内场所
        floors: [], // 楼层信息
        startPoi: null, // 起点
        endPoi: null, // 终点，
        center: null, // 地图中心点
        scale: 18, // 地图缩放级别
        markers: [], // poi
        polylines: [], // 各种室内面和线
        circles: [], // 各种点
        route: null // 路径规划详情
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('load')
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        console.log('ready')
    },

    getBuildingLines(building) {
        return util.wkt2Polyline(building.geometry, {
            width: 5,
            color: '#FF0000DD',
            dottedLine: true
        })
    },

    getFloorInfo: function (floorId) {
        const proms = []
        proms.push(ajax.get(`indoor/building/floor/link/${floorId}`).then(res => {
            const lines = []
            res.forEach(it => {
                lines.push(...util.wkt2Polyline(it.geometry, {
                    color: '#212EBE',
                    width: 1,
                }))
            })

            return lines
        }).catch(err => []))
        proms.push(ajax.get(`indoor/building/floor/node/${floorId}`).then(res => {
            return res.map(it => util.point2Circle(it.geometry))
        }).catch(err => []))
        proms.push(ajax.get(`indoor/building/floor/poi/${floorId}`).then(res => {
            return res.map(it => util.point2Circle(it.geometry, {
                color: '#FF0000DD',
                fillColor: '#FF0000DD',
                radius: 0.2,
                strokeWidth: 0
            }))
        }).catch(err => []))
        proms.push(ajax.get(`indoor/building/floor/poiFace/${floorId}`).then(res => {
            const lines = []
            res.forEach(it => {
                lines.push(...util.wkt2Polyline(it.geometry, {
                    color: '#FF0000FF',
                    width: 1,
                }))
            })

            return lines
        }).catch(err => []))

        return Promise.all(proms).then(res => {
            return {
                polylines: [...res[0], ...res[3]],
                circles: [...res[1], ...res[2]]
            }
        })
    },

    getBuildingInfo: function (buildingId) {
        const proms = []
        proms.push(ajax.get(`indoor/building/${buildingId}`).then(res => {
            return res[0]
        }))

        proms.push(ajax.get(`indoor/building/floor/${buildingId}`).then(res => {
            return res
        }))

        return Promise.all(proms).then(res => {
            const building = res[0]
            const floors = res[1]

            const defFl = building.default_fl || 1
            let floorId
            for (const fl of floors) {
                if (fl.fl_num === defFl) {
                    floorId = fl.id
                }
            }

            const centerCoord = building.center_coordinate.split(',')
            const center = {
                lon: centerCoord[0],
                lat: centerCoord[1]
            }

            return this.getFloorInfo(floorId).then(rest => ({
                building: building,
                floors: floors,
                center: center,
                polylines: [...this.getBuildingLines(building), ...rest.polylines],
                circles: rest.circles
            }))
        }).catch(err => null)
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        const data = {}
        const that = this
        // todo: 从缓存中取出buildingId，向服务请求buiding的详情，包括名称、平面图，楼层数等等
        // req: 查询building详情的接口
        data.building = wx.getStorageSync('building')
        data.startPoi = wx.getStorageSync('startPoi')
        data.endPoi = wx.getStorageSync('endPoi')
        if (data.building) {
            this.getBuildingInfo(data.building.id).then(res => {
                if (res) {
                    res.scale = 22
                    this.setData(res)
                }                
            })

            // data.markers = []
            // if (data.startPoi) {
            //     data.markers.push({
            //         id: data.startPoi.id,
            //         latitude: data.startPoi.geometry.coordinates[0],
            //         longitude: data.startPoi.geometry.coordinates[1],
            //         iconPath: '',
            //         width: 30,
            //         height: 50,
            //         anchor: {
            //             x: 0.5,
            //             y: 1
            //         }
            //     })
            // }
            // if (data.endPoi) {
            //     data.markers.push({
            //         id: data.endPoi.id,
            //         latitude: data.endPoi.geometry.coordinates[0],
            //         longitude: data.endPoi.geometry.coordinates[1],
            //         iconPath: '',
            //         width: 30,
            //         height: 50,
            //         anchor: {
            //             x: 0.5,
            //             y: 1
            //         }
            //     })
            // }
            // if (data.startPoi && data.endPoi) {
            //     // todo: 调用接口计算路径规划
            //     // req: 计算路径规划的服务接口
            //     const res = { // 模拟服务结构返回的数据
            //         data: [{
            //             brief: '步行1024米，搭乘3次扶梯，1次直梯，约15分钟。',
            //             memo: 'A座，乘扶梯下3层，B座，乘直梯上15层。',
            //             polylines: {
            //                 type: 'LineString',
            //                 coordinates: [data.startPoi.geometry.coordinates, [34.22259, 108.94878], data.endPoi.geometry.coordinates]
            //             }
            //         }]
            //     }
            //     data.route = res
            //     data.polylines = [{
            //         points: res.data[0].route.coordinates.map(it => ({
            //             latitude: it[0],
            //             longitude: it[1]
            //         })),
            //         color: "#FF0000DD",
            //         width: 2,
            //         dottedLine: true
            //     }]
            // }

            // this.setData(data)
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        console.log('hide')
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        console.log('unload')
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    selectBuilding: function () {
        wx.navigateTo({
            url: '../building/building',
        })
    },

    selectStart: function () {

    },

    selectEnd: function () {

    },

    /**
     * 切换楼层
     * todo: 切换楼层后，向服务接口请求对应楼层的平面图
     * req: 根据buildingId和楼层，查询楼层平面图
     */
    floorChange(e) {
        const floor = this.data.floors[e.detail.value]
        this.getFloorInfo(floor.id).then(rest => {
            this.setData({
                polylines: [...this.getBuildingLines(this.data.building), ...rest.polylines],
                circles: rest.circles
            })
        })
    },

    /**
     * 获取当前定位
     */
    locate(e) {
        wx.getLocation({
            type: 'gcj02',
            success: res => {
                var latitude = res.latitude
                var longitude = res.longitude
                var speed = res.speed
                var accuracy = res.accuracy
                this.setData({
                    center: {
                        lat: res.latitude,
                        lon: res.longitude
                    },
                    scale: 18
                })
            }
        })
    },
})
