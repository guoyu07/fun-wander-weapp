// pages/building/building.js
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
    onLoad: function(options) {
        let data = [{
                id: 1,
                name: '荣民龙首广场',
                address: '西安市莲湖区未央路19号',
                distance: 11828
            },
            {
                id: 2,
                name: 't-赢樾国际大厦',
                address: '西安市锦业路103号',
                distance: 0
            },
            {
                id: 3,
                name: 't-高新医院',
                address: '',
                distance: 10000
            },
            {
                id: 4,
                name: 't-咸阳国际机场',
                address: '',
                distance: 60000
            }
        ];
        data.forEach(it => {
            if (it.distance < 1000) {
                it.distance = it.distance + '米';
            } else {
                it.distance = Math.floor(it.distance / 100) / 10 + '公里';
            }
        });

        this.setData({
            buildings: data
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

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
     * todo
     * 根据输入内容查可导航的建筑物
     * req: 服务接口
     */
    searchByTip: function(e, tip) {

    },

	searchBuilding: function () {
		wx.navigateTo({
			url: '../search/search',
		})
	},

    /**
     * 单击选中一个建筑物
     */
    selectBuilding: function(e) {
        const data = e.currentTarget.dataset.building;
        wx.setStorageSync('building', data);
        wx.navigateBack();
    }
})