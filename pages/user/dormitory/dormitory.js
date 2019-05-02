var window = (function (){
  return this
})();
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stepList: ["基本信息", "物业参数", "配套信息"],
    orderAttr: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let preData = window.getCurrentPages()[window.getCurrentPages().length-2].data;
    this.setData({
      ...preData
    });
    wx.setNavigationBarTitle({
      title: this.data.dormitoryName
    })
    
  },
   
  tabClick: function(e){
    this.setData({
      orderAttr: e.target.dataset.index
    })
  }
})