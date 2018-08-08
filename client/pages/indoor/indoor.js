// pages/indoor/indoor.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        building: null, // 室内场所
        startPoi: null, // 起点
        endPoi: null, // 终点，
        center: null, // 地图中心点
        scale: 18, // 地图缩放级别
        markers: [], // 起终点
        polylines: [], // 路径规划
        route: null // 路径规划详情
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log('load');
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        console.log('ready');
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        const data = {};
        // todo: 从缓存中取出buildingId，向服务请求buiding的详情，包括名称、平面图，楼层数等等
        // req: 查询building详情的接口
        data.building = wx.getStorageSync('building') || {};
        data.building.floors = [1, 2, 3]; // 楼层
        data.startPoi = wx.getStorageSync('startPoi');
        data.endPoi = wx.getStorageSync('endPoi');
        if (data.building) {
            data.center = {
                lat: 34.22259,
                lon: 108.94878
            };
            data.scale = 18;
            data.markers = [];
            if (data.startPoi) {
                data.markers.push({
                    id: data.startPoi.id,
                    latitude: data.startPoi.geometry.coordinates[0],
                    longitude: data.startPoi.geometry.coordinates[1],
                    iconPath: '',
                    width: 30,
                    height: 50,
                    anchor: {
                        x: 0.5,
                        y: 1
                    }
                });
            }
            if (data.endPoi) {
                data.markers.push({
                    id: data.endPoi.id,
                    latitude: data.endPoi.geometry.coordinates[0],
                    longitude: data.endPoi.geometry.coordinates[1],
                    iconPath: '',
                    width: 30,
                    height: 50,
                    anchor: {
                        x: 0.5,
                        y: 1
                    }
                });
            }
            if (data.startPoi && data.endPoi) {
                // todo: 调用接口计算路径规划
                // req: 计算路径规划的服务接口
                const res = { // 模拟服务结构返回的数据
                    data: [{
                        brief: '步行1024米，搭乘3次扶梯，1次直梯，约15分钟。',
                        memo: 'A座，乘扶梯下3层，B座，乘直梯上15层。',
                        polyline: {
                            type: 'LineString',
                            coordinates: [data.startPoi.geometry.coordinates, [34.22259, 108.94878], data.endPoi.geometry.coordinates]
                        }
                    }]
                };
                data.route = res;
                data.polylines = [{
                    points: res.data[0].route.coordinates.map(it => ({
                        latitude: it[0],
                        longitude: it[1]
                    })),
                    color: "#FF0000DD",
                    width: 2,
                    dottedLine: true
                }];
            }

            this.setData(data);
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        console.log('hide');
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        console.log('unload');
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },

    selectBuilding: function() {
        wx.navigateTo({
            url: '../building/building',
        })
    },

    selectStart: function() {

    },

    selectEnd: function() {

    },

    /**
     * 切换楼层
     * todo: 切换楼层后，向服务接口请求对应楼层的平面图
     * req: 根据buildingId和楼层，查询楼层平面图
     */
    floorChange(e) {
        console.log(e.detail.value);
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
                });
            }
        })
    },
})