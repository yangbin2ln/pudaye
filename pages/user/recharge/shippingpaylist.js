var util = require('../../../utils/util.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl: app.data.imgurl,
    stepList: ["未支付运费订单", "已支付运费订单"],
    selectIndex: 0,
    shipppingpayList: [],
    url: "",
    isAuth: false,
    actionSheetHidden: true,
    actionSheetItems: [],
    actionSheetCode: [],
    actionSheetIcon: [],
    shippingCode: "",
    sumPrice: -1,
    showPay: true,
    projectName: app.data.projectName
  },


  tabClick: function(e) {
    var self = this;
    self.setData({
      showPay: e.currentTarget.dataset.index == "0"
    });
    if (e.currentTarget.dataset.index == "0") {
      util.request(app.data.apiurl + 'api/Pay/GetShipping', {
        userid: app.data.logininfo.user_id
      }, function(res) {
        self.setData({
          shipppingpayList: res.data.list,
          shippingCode: res.data.shippingCode,
          sumPrice: res.data.sum,
        });
      });
    } else {
      util.request(app.data.apiurl + 'api/Pay/GetfinishShippingList', {
        userid: app.data.logininfo.user_id
      }, function(res) {
        self.setData({
          shipppingpayList: res.data.list,
        });
      });
    }
    this.setData({
      selectIndex: e.currentTarget.dataset.index
    });
  },

  onLoad: function(options) {
    var self = this;
    // 检查是否已经登录
    if (!app.loginCheck("/pages/users/shippingpay/shippingpay")) {
      return;
    }
    util.request(app.data.apiurl + 'api/Pay/GetShipping', {
      userid: app.data.logininfo.user_id
    }, function(res) {
      self.setData({
        shipppingpayList: res.data.list,
        shippingCode: res.data.shippingCode,
        sumPrice: res.data.sum
      });
    });

    if (options.showPay != undefined) {
      this.setData({
        showPay: options.showPay
      });
    }

    this.setData({
      actionSheetItems: app.data.actionSheetItems,
      actionSheetCode: app.data.actionSheetCode,
      actionSheetIcon: app.data.actionSheetIcon
    });
  },

  actionSheet: function() {
    this.setData({
      //取反
      actionSheetHidden: !this.data.actionSheetHidden
    });
  },
  itemTap: function(e) {
    var self = this;
    if (e.detail.target.dataset.index == 0) {
      app.WxPayShippping(this.data.shippingCode, e.detail.formId);
    } else if (e.detail.target.dataset.index == 1) {
      self.setData({
        isAuth: false
      });
      app.OtherPayShippping(this.data.shippingCode, e.detail.formId, function(e) {
        self.setData({
          url: self.data.imgurl + e.data.list
        });
      });
    }
    this.actionSheet();
  },

  saveImage: function(e) {
    var self = this;
    var url = e.currentTarget.dataset.url;
    wx.downloadFile({
      url: url,
      success: function(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function(res) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000,
              complete: function() {
                self.hideModal();
              }
            });
          },
          fail: function(res) {
            util.showErrorModal('保存失败，请授权', function(e) {
              self.setData({
                isAuth: true
              });
            });
          }
        })
      },
      fail: function() {
        util.showErrorModal('保存失败，请授权');
      }
    })
  },
  hideModal: function() {
    this.setData({
      url: ""
    });
  },
  opensetting: function(e) {
    if (e.detail.authSetting["scope.writePhotosAlbum"]) {
      this.saveImage(e);
    } else {
      util.showErrorModal('请授权');
    }
  }
})