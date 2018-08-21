// pages/location/location.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    center: {
      lon: 108.94878,
      lat: 34.22259
    },
    scale: 16,
    fooltFlag: false,
    searchName: '',
    searchListAll: [{ name: '盈樾国际-四维图新', selected: false, subName: 'A座 10-13层' }, { name: '盈樾国际-葛洲坝集团', selected: false, subName: 'A座 20-23层' }, { name: '盈樾国际-汉堡王', selected: false, subName: 'B座 1层' }, { name: '盈樾国际-星巴克', selected: false, subName: 'A座 1层' }, { name: '盈樾国际-咖啡王', selected: false, subName: 'C座 1层1001室' }, { name: '盈樾国际-完美造型', selected: false, subName: 'C座 2层2011室' }, { name: '盈樾国际测试一', selected: false, subName: 'C座 1层1001室' }, { name: '盈樾国际-测试二', selected: false, subName: 'C座 1层1001室' }, { name: '盈樾国际-测试三', selected: false, subName: 'C座 1层1001室' }, { name: '盈樾国际-测试四', selected: false, subName: 'C座 1层1001室' }, { name: '盈樾国际-测试五', selected: false, subName: 'C座 1层1001室' }],
    searchList: [],
    selectedStore: '',
    flag: null, // 标记选择的是起点还是终点
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var flag = this.options.flag;
    this.data.flag = flag;
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

  showOrHideFooter(flag) {
    this.setData({
      fooltFlag: flag
    });
  },

  searchList(value) {
    var list = [];
    for (var i = 0; i < this.data.searchListAll.length; i++) {
      var temp = this.data.searchListAll[i];
      if (temp.name.indexOf(value) > -1 ){
        list.push({
          name: temp.name,
          selected: false,
          subName: temp.subName
        });
      }
    }
    this.setData({
      searchList: list
    });
  },

  selectedItem(event) {
    var select = event.currentTarget.dataset.select;
    for (var i = 0; i < this.data.searchList.length; i++) {
      var temp = this.data.searchList[i];
      if (select.name == temp.name) {
        temp.selected = true;
      } else {
        temp.selected = false;
      }
    }
    this.setData({
      searchList: this.data.searchList
    });
  },
  
  autoSearch(e) {
    let value = e.detail.value;
    if (value === '') {
      this.showOrHideFooter(false);
      return;
    }
    this.setData({
      searchName: value
    });
    this.searchList(value);
    this.showOrHideFooter(true);
  },

  confirm() {
    var select = null;
    for (var i = 0; i < this.data.searchList.length; i++) {
      if (this.data.searchList[i].selected) {
        select = this.data.searchList[i];
        break;
      }
    }
    if (select) {
      if (this.data.flag == 'start') {
        wx.setStorageSync('startLocation', select);
      } else {
        wx.setStorageSync('endLocation', select);
      }
      wx.navigateTo({
        url: '../indoor/indoor',
      })
    }
  }
})