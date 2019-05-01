
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 当前页
    pageNumber: 1,
    // 总页数
    totalPage: 1,
    orderType: "",
    imgurl: app.data.imgurl,
    actionSheetHidden: true,
    actionSheetItems: [],
    actionSheetCode: [],
    actionSheetIcon: [],
    orderCode: "",
    url: "",
    isAuth: false,

    shippingCount: 0,

    stepList: ["基本信息", "物业参数", "配套信息"],
    orderAttr: 0,
    projectName: app.data.projectName
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      orderAttr: options.index
    });
    wx.setNavigationBarTitle({
      title: titel
    })
    
    this.setData({
      actionSheetItems: app.data.actionSheetItems,
      actionSheetCode: app.data.actionSheetCode,
      actionSheetIcon: app.data.actionSheetIcon,
      orderType: orderType
    });
  },
  GetOrderList: function(user_id, orderType, pageNumber, orderAttr, callback) {
    var self = this;
    util.request(app.data.apiurl + 'api/Order/GetOrderList', {
      user_id: app.data.logininfo.user_id,
      orderType: this.data.orderType,
      pageNumber: pageNumber,
      orderAttr: orderAttr
    }, function(res) {
      if (typeof callback == "function") {
        callback(res);
      }
    }, null, true)
  },
  tabClick: function(e){
    this.setData({
      orderAttr: e.target.dataset.index
    })
  }
})