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
    localip: ''
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
    if (this.data.mobile == "") {
      util.showErrorModal("手机号码不能为空");
      return;
    }
    var self = this;
    util.request(app.data.apiurl + 'api/Index/SendValid', {
      mobile: self.data.mobile
    }, function(res) {
      if (res.data.list == 0) {
        util.showErrorModal("手机号不正确");
      } else {
        util.showErrorModal("验证码发送成功");
      }
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
    util.request(app.data.apiurl + 'api/Index/ResetPassword', {
      mobile: self.data.mobile,
      validcode: self.data.validcode,
      newPassword: self.data.password
    }, function(res) {
      if (res.data.list == -1) {
        util.showErrorModal("验证码不正确");
      } else if (res.data.list == 0) {
        util.showErrorModal("手机号不存在");
      } else {
        util.showErrorModal("密码重置成功请登录", function() {
          wx.navigateBack({
            delta: 1
          });
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

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