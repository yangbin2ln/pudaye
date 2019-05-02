var util = require('../../utils/util.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl: app.data.apiurl + "images/",
    isLogin: app.isLogin(),
    noPayCount: 0,
    noSendgoodCount: 0,
    noReceiveCount: 0,
    is_validated:0,
    user_card: ""
  },
  logout: function() {
    var logininfo = {};
    logininfo.user_id = "";
    logininfo.user_name = "";
    logininfo.user_rank = "";
    app.data.logininfo = logininfo;
    this.setData({
      isLogin: false
    });
    wx.removeStorageSync(app.data.logininfokey);
    util.showErrorModal("注销成功", function() {
      wx.redirectTo({
        url: '/pages/user/login_reg/login_reg',
      })
    });
  },

  onLoad(options) {
    if(!app.isLogin()){
      wx.redirectTo({
        url: '/pages/user/login_reg/login_reg',
      });
    }
  },
 
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      isLogin: app.isLogin()
    });
  },
})