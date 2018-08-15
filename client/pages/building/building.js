// pages/building/building.js
const QQMapWX = require('../../libs/qqmap-wx-jssdk1.0/qqmap-wx-jssdk.js');
const util = require('../../utils/util')
const ajax = require('../../utils/ajax')

var qqmapsdk;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        buildings: []
    },

    /**
     * 生命周期函数--监听页面加载
     * todo
     * 调用服务接口，查询附近可进行室内导航的建筑物
     * req: 根据位置查询周边可导航的建筑物接口
     */
    onLoad: function (options) {
        qqmapsdk = new QQMapWX({
            key: '4GDBZ-34DC2-ZPJUC-CXIJY-JSYM2-GCBK3'
        });

        const distance = (from, to) => {
            return new Promise((resolve, reject) => {
                qqmapsdk.calculateDistance({
                    from: from,
                    to: to,
                    success: res => {
                        resolve(res.result.elements[0].distance);
                    }
                });
            });
        };

        const calcDist = (loc, data) => {
            const p = data.map(it => {
                const latlon = util.reverseStr(it.center_coordinate, ',')
                return distance(loc, latlon).then(dist => {
                    it.distance = dist
                });
            });

            return Promise.all(p);
        };

        const that = this;
        wx.getLocation({
            type: '',
            success: res => {
                const yLoc = res.latitude + ',' + res.longitude;
                ajax.get('indoor/building').then(rest => {
                    const buildings = rest

                    calcDist(yLoc, buildings).then(() => {
                        this.setData({
                            buildings: buildings.sort((a, b) => a.distance > b.distance)
                        });
                    })
                }).catch(err => {
                    this.setData({
                        buildings: []
                    });
                }) 
            },
            fail: err => {
                console.log(err)
            }
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

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

    /**
     * todo
     * 根据输入内容查可导航的建筑物
     * req: 服务接口
     */
    bindKeyInput: function (e) {
        const val = e.detail.value;
        const data = this.data.allBuildings;
        this.setData({
            buildings: data.filter(it => it.name.indexOf(val) >= 0)
        });
    },

    /**
     * 单击选中一个建筑物
     */
    selectBuilding: function (e) {
        const data = e.currentTarget.dataset.building;
        wx.setStorageSync('building', data);
        wx.navigateBack();
    }
})
