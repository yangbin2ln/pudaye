var util = require('../../utils/util.js');
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
     fileurl: getApp().data.fileurl
  },
  
  goTop: function (e) {
    this.setData({
      scrollTop: 0
    })
  },
  scroll: function (e) {
    if (e.detail.scrollTop > 300) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },
  onShareAppMessage() {

  },
  gotocart: function () {
    wx.makePhoneCall({
      phoneNumber: '1340000****' // 仅为示例，并非真实的电话号码
    })
  },
  gotocart2: function () {
    wx.makePhoneCall({
      phoneNumber: '1516699****' // 仅为示例，并非真实的电话号码
    })
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    //设置可转发
    wx.showShareMenu({
      withShareTicket: true
    });

    util.request(
      app.data.apiurl + '/web/dormitoryinfo/load', {
        id: options.id,
      },
      function(res) {
        let lunboImgs = res.data.lunboImgs;
        let huxingImgs = res.data.huxingImgs;
        if(lunboImgs){
          lunboImgs = JSON.parse(lunboImgs);
        }
        if(huxingImgs){
          huxingImgs = JSON.parse(huxingImgs);
        }
         self.setData({
          ...res.data,
          lunboImgsArr: lunboImgs,
          huxingImgsArr: huxingImgs,
         });

         wx.setNavigationBarTitle({
          title: self.data.dormitoryName
        })
      }
    );

  },
  
  viewImg: function(e){
    getApp().viewImg(e);
  },

  collect: function(e){
    Page.onShareAppMessage();
  }
})