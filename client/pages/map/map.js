// pages/map/map.js.js
var QQMapWX = require('../../libs/qqmap-wx-jssdk1.0/qqmap-wx-jssdk.js');
var qqmapsdk;

Page({
    /**
     * 页面的初始数据
     */
    data: {
        scale: 15,
        center: {
            lat: 23.099994,
            lon: 113.324520            
        },
        markers: [{
            iconPath: "/resources/location.png",
            id: 0,
            latitude: 23.099994,
            longitude: 113.324520,
            width: 26,
            height: 53
        }],
        polyline: [{
            points: [{
                longitude: 113.3245211,
                latitude: 23.10229
            }, {
                longitude: 113.324520,
                latitude: 23.21229
            }],
            color: "#FF0000DD",
            width: 2,
            dottedLine: true
        }]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        qqmapsdk = new QQMapWX({
            key: '4GDBZ-34DC2-ZPJUC-CXIJY-JSYM2-GCBK3'
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        this.mapCtx = wx.createMapContext('map');
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

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

    /**
     * 放大地图
     */
    scaleOut(e) {
        if (this.data.scale < 20) {
            this.setData({
                scale: this.data.scale + 1
            });
        }
    },

    /**
     * 缩小地图
     */
    scaleIn(e) {
        if (this.data.scale > 5) {
            this.setData({
                scale: this.data.scale - 1
            });
        }
    },

    /**
     * 地图导航
     */
    route(e) {
        wx.navigateTo({
            url: '../route/route',
        })
    },

    /**
     * 室内导航
     */
    indoor(e) {
        wx.navigateTo({
            url: '../indoor/indoor',
        })
    },

    /**
     * 地图显示区域修改
     */
    regionchange(e) {
        if (e.type === 'end') {
            this.mapCtx.getScale({
                success: res => {
                    this.data.scale = res.scale;
                }
            });
        }        
    },

    markertap(e) {
        console.log(e.markerId)
    },
})