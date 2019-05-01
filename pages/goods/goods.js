var util = require('../../utils/util.js');
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    chooseSize: false,
    animationData: {},
    id: '',
    scrollTop: 0,
    floorstatus: false,
    modalHidden: false,
    // 轮播
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    imgurl: app.data.imgurl,
    goodsimgurl: app.data.goodsimgurl,
    //名称
    goodsid: '',
    goods_name: '',
    goods_sn: '',
    goodimg: [],
    goodimgdetail: '',
    sales_volume_base: 0,
    goodsattr: '',
    goodsprice: "",

    numa: 1,
    scrollLength: 0,
    modalHidden: true,
    modalHidden2: true,
    collect: false,
    imgUrls: [],
    goodsNumber: 0,
    atrList: [],
    general_price: "",
    general_pricejp: "",

    isLogin: false,
    is_validated: 0,
    new_presell_num: 0,
    new_presell_date: "",
    goodimgShow: []
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
    //设置可转发
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  
  viewImg: function(e){
    getApp().viewImg(e);
  },

  collect: function(e){
    Page.onShareAppMessage();
  }
})