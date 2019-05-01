var util = require('../../utils/util.js');
var filter = require('../../utils/filter.js');
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [{
      name: '世纪优盘',
      area: '110-180',
      avePrice: 9800,
      labelArr: ['近地铁', '教育资源'],
      address: '世纪大道'
    },{
      name: '鸿基新城',
      area: '85-220',
      avePrice: 13000,
      labelArr: ['近地铁', '教育资源', '配套成熟'],
      address: '雁塔区科技四路'
    },{
      name: '大润城',
      area: '85-180',
      avePrice: 14000,
      labelArr: ['近地铁', '沣东'],
      address: '沣东新城'
    },{
      name: '金科世纪城',
      area: '85-220',
      avePrice: 11000,
      labelArr: ['交通便利', '品牌开发商'],
      address: '沣西新城'
    }],
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
 
 
  // startPullDownRefresh() {
  //   // wx.stopPullDownRefresh()
  // }
})