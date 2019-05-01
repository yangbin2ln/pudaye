var util = require('../../utils/util.js');
var filter = require('../../utils/filter.js');
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    dormitoryName: '',
    imgUrls: [],
    floorstatus: false,
    goodsimgurl: app.data.goodsimgurl,
    imgurl: app.data.imgurl,

    sort_group: ['销量', '价格', '人气', '筛选'],
    sort_selected: 0,
    goods_message: [],
    order: "DESC",
    // 当前页
    pageNumber: 1,
    // 总页数
    totalPage: 1,

    isLogin: false,
    is_validated: false,
    isShowFilter: false,
    brandshowMore: false,
    categoryshowMore: false,

    attrSelect: [],
    categorySelect: [],
    brandSelect: [],

    keywords: "",
    hottype: "",
    hottypeName: "",

    ishaveSelect: false,
    hide_good_box: true,
    list: [],
    fixfilter: false,
    shippingCount: 0,
    isPromote: false,
    adName: "",
  },
  scancodeEx: function() {
    // 检查是否已经登录
    if (!app.loginCheck()) {
      return;
    }
    var self = this;
    wx.scanCode({
      success: function(res) {
        util.request(
          app.data.apiurl + 'api/Goods/AddToCart', {
            user_id: app.data.logininfo.user_id,
            goods_number: 1,
            goods_sn: res.result,
            goods_attr: "日本仓直邮"
          },
          function() {
            app.getCartCount(function(e) {
              self.setData({
                CartCount: e
              });
            });
            self.scancodeEx();
          }
        );
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },
  searchtopInput: function(e) {
    this.setData({
      searchtop: e.detail.value
    })
  },
  searchtop: function(e) {

    this.data.keywords = this.data.searchtop;
    if (this.data.keywords == undefined) {
      this.data.keywords = "";
    }
    this.getGoodsInfo(true); 
  },
  
  goTop: function(e) {
    this.setData({
      scrollTop: 0
    });
  },
  onLoad: function (options) {
    //设置可转发
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  onShow: function(){
    let self = this;
    util.request(
      app.data.apiurl + '/web/dormitoryinfo/loadAllGrid', {
        dormitoryName: self.data.dormitoryName,
      },
      function(res) {
         self.setData({
          goodsList: res.data
         });
      }
    );
  }
 
  // startPullDownRefresh() {
  //   // wx.stopPullDownRefresh()
  // }
})