var util = require('../../utils/util.js');
var filter = require('../../utils/filter.js');
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    fileurl: getApp().data.fileurl,
    goodsList: [],
    dormitoryName: '',
    sort_group: ['销量', '价格', '人气', '筛选'],

    isLogin: false,
    
    keywords: "",
    
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
    let self = this;
    this.setData({
      searchtop: e.detail.value
    });
  },
  searchtop: function(e) {
    let self = this;
    util.request(
      app.data.apiurl + '/web/dormitoryinfo/loadAllGrid', {
        dormitoryName: self.data.searchtop,
      },
      function(res) {
        let data = res.data;
        for(key in data){
          if(data[key].labelNames){
            data[key].labelNamesArr = data[key].labelNames.split(',');
          }
          if(data[key].smallImgs){
            let sarr = JSON.parse(data[key].smallImgs);
            if(sarr.length > 0){
              data[key].smallImgSin = sarr[0].filePath;
            }
          }
        }
        self.setData({
          goodsList: res.data
        });
      }
    );
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
    });

      if(!app.isLogin()){
        wx.redirectTo({
          url: '/pages/user/login_reg/login_reg',
        });
      }
  },
  onShow: function(){
    let self = this;
    util.request(
      app.data.apiurl + '/web/dormitoryinfo/loadAllGrid', {
        dormitoryName: self.data.dormitoryName,
      },
      function(res) {
        let data = res.data;
        for(key in data){
          if(data[key].labelNames){
            data[key].labelNamesArr = data[key].labelNames.split(',');
          }
          if(data[key].smallImgs){
            let sarr = JSON.parse(data[key].smallImgs);
            if(sarr.length > 0){
              data[key].smallImgSin = sarr[0].filePath;
            }
          }
        }
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