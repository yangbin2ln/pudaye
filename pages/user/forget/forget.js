// pages/user/forget/forget.js
var util = require('../../../utils/util.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    validcode: '',
    password: '',
    confirmpassword: '',
    localip: '',
    isSend: false,
    remainSeconds: 60
  },
  mobile: function(e) {
    this.data.mobile = e.detail.value;
  },
  validcode: function(e) {
    this.data.validcode = e.detail.value;
  },
  password: function(e) {
    this.data.password = e.detail.value;
  },
  confirmpassword: function(e) {
    this.data.confirmpassword = e.detail.value;
  },
  sendvalid: function(e) {
    let self = this;
    if (this.data.mobile == "") {
      util.showErrorModal("手机号码不能为空");
      return;
    }
    util.request(app.data.apiurl + '/web/sms/send', {
      mobile: self.data.mobile
    }, function(res) {     
        util.showErrorModal("验证码发送成功");
        self.setData({
          isSend: true,
          remainSeconds: 60
        });
        let t = setInterval(function(){
          self.setData({
            remainSeconds: --self.data.remainSeconds
          });
        }, 1000);
        setTimeout(function(){
          self.setData({
            isSend: false
          });
          clearInterval(t);
        }, 60000);

    });
  },
  resetPassword: function(e) {
    if (this.data.mobile == "") {
      util.showErrorModal("手机号码不能为空");
      return;
    }
    if (this.data.validcode == "") {
      util.showErrorModal("验证码不能为空");
      return;
    }
    if (this.data.password == "") {
      util.showErrorModal("新密码不能为空");
      return;
    }
    if (this.data.password != this.data.confirmpassword) {
      util.showErrorModal("两次密码不一致");
      return
    }
    var self = this;
    util.request(app.data.apiurl + '/wechat/login', {
      mobile: self.data.mobile,
      code: self.data.validcode,
      pwd: self.data.password
    }, function(res) {
      var logininfo = wx.getStorageSync(app.data.logininfokey);
      logininfo.mobile = res.data.mobile;
      wx.setStorageSync(app.data.logininfokey, logininfo);
      wx.switchTab({
        url: '/pages/user/user'
      });
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // if(app.isBindMobile()){
    //   wx.redirectTo({
    //     url: '/pages/user/login_reg/login_reg',
    //   });
    // }
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

  }
})