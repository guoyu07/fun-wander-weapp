// pages/building/building.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pois: [],
		searchValue: null,
		shortCuts: [
			{ name: '中餐', url: '../../resources/shortcuts/zhongcan.png', active: false },
			{ name: '西餐', url: '../../resources/shortcuts/xican.png', active: false },
			{ name: '服饰', url: '../../resources/shortcuts/shopping.png', active: false },
			{ name: '厕所', url: '../../resources/shortcuts/wc.png', active: false },
			{ name: '电梯', url: '../../resources/shortcuts/elevator.png', active: false },
			{ name: '影院', url: '../../resources/shortcuts/movie.png', active: false }
		],
		searchArea: null,
		searchicon: '../../resources/search_now_1.png'
    },

    /**
     * 生命周期函数--监听页面加载
     * todo
     * 调用服务接口，查询附近可进行室内导航的建筑物
     * req: 根据位置查询周边可导航的建筑物接口
     */
    onLoad: function(options) {
        
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
		const area = wx.getStorageSync('building') || {};
		this.setData({ searchArea: area });
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

    setDataList: function () {
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
		},
		{
			id: 5,
			name: 't-高薪万达one广场',
			address: '陕西省西安市雁塔区唐延路和科技6路交汇处',
			distance: 2600
		},
		{
			id: 6,
			name: '阳光新天地-高新店',
			address: '西安市雁塔区熙沣路13号',
			distance: 2000
		},
		{
			id: 7,
			name: 't-高薪万达one广场',
			address: '陕西省西安市雁塔区唐延路和科技6路交汇处',
			distance: 2600
		},
		{
			id: 8,
			name: 't-高薪万达one广场',
			address: '陕西省西安市雁塔区唐延路和科技6路交汇处',
			distance: 2600
		},
		];

		let randDomNum = Math.floor(Math.random() * 8);
		randDomNum = randDomNum ? randDomNum : 1;
		data = data.slice(0, randDomNum);
		data.forEach(it => {
			if (it.distance < 1000) {
				it.distance = it.distance + '米';
			} else {
				it.distance = Math.floor(it.distance / 100) / 10 + '公里';
			}
		});
		this.setData({ pois: data });
	},

    /**
     * 单击选中一个建筑物
     */
	selectSearchResult: function(e) {
		console.log(e.currentTarget.dataset);
        // const data = e.currentTarget.dataset.building;
        // wx.setStorageSync('building', data);
        // wx.navigateBack();
    },

	/**
	 * 获取用户输入
	 */
	userNameInput: function (e) {
		this.setData({
			searchValue: e.detail.value
		})
	},

	/**
	 * 点击快捷按钮
	 */
	tapShotCut: function (e) {
		let selectFlag = false;
		const currentShotCut = e.currentTarget.dataset.shortcut;
		this.data.shortCuts.forEach((item, index) => {
			if (item.name === currentShotCut.name) {
				const currentStatus = !currentShotCut.active;
				selectFlag = currentStatus;
				this.setData({ ['shortCuts[' + index + '].active']: currentStatus });
			} else {
				this.setData({ ['shortCuts[' + index + '].active']: false });
			}
		});
		// 模拟加载;
		if (!selectFlag) return;
		wx.showLoading({
			title: '正在拼命加载中',
		})
		setTimeout(() => {
			this.setDataList();
			wx.hideLoading();
		}, 1000);
	},

	/**
	 * 搜索结果
	 */
	sarching: function (e) {
		if (this.data.searchValue) {
			wx.showLoading({
				title: '正在拼命加载中',
			})
			setTimeout(() => {
				this.setDataList();
				wx.hideLoading();
			}, 1000);
		}
	}
})