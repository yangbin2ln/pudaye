
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsimgurl: app.data.goodsimgurl,
    orderList: '',
    // 当前页
    pageNumber: 1,
    // 总页数
    totalPage: 1,
    orderType: "",
    imgurl: app.data.imgurl,
    actionSheetHidden: true,
    actionSheetItems: [],
    actionSheetCode: [],
    actionSheetIcon: [],
    orderCode: "",
    url: "",
    isAuth: false,

    shippingCount: 0,

    stepList: ["报备规则", "带看规则", "结佣规则", "售盘指导"],
    orderAttr: 0,
    projectName: app.data.projectName
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {


    var orderType = "";
    if (options.orderType != undefined) {
      orderType = options.orderType;
    }
    if (options.orderAttr != undefined) {
      this.setData({
        orderAttr: options.orderAttr
      });
    }

    var titel = "";
    if (orderType == "1") {
      titel = "待付款";
    } else if (orderType == "2") {
      titel = "待发货";
    } else if (orderType == "3") {
      titel = "待收货";
    } else {
      titel = "全部订单";
    }

    wx.setNavigationBarTitle({
      title: titel
    })



    this.setData({
      actionSheetItems: app.data.actionSheetItems,
      actionSheetCode: app.data.actionSheetCode,
      actionSheetIcon: app.data.actionSheetIcon,
      orderType: orderType
    });
  },
  GetOrderList: function(user_id, orderType, pageNumber, orderAttr, callback) {
    var self = this;
    util.request(app.data.apiurl + 'api/Order/GetOrderList', {
      user_id: app.data.logininfo.user_id,
      orderType: this.data.orderType,
      pageNumber: pageNumber,
      orderAttr: orderAttr
    }, function(res) {
      if (typeof callback == "function") {
        callback(res);
      }
    }, null, true)
  },

  tabClick: function(e) {
    var self = this;
    this.setData({
      orderAttr: e.currentTarget.dataset.index
    });
    this.GetOrderList(app.data.logininfo.user_id, this.data.orderType, 1, this.data.orderAttr, function(res) {
      self.setData({
        orderList: res.data.list,
        totalPage: res.data.totalPage,
        pageNumber: 1,
        shippingCount: res.data.shippingCount
      });
    })
  },

  shippingpay: function() {
    wx.navigateTo({
      url: '/pages/user/shippingpay/shippingpay',
    })
  },

  onShow: function() {
    var self = this;
    // 检查是否已经登录
    var that = this;
    if (!app.loginCheck()) {
      return;
    }
    this.GetOrderList(app.data.logininfo.user_id, this.data.orderType, 1, this.data.orderAttr, function(res) {
      self.setData({
        orderList: res.data.list,
        totalPage: res.data.totalPage,
        pageNumber: 1,
        shippingCount: res.data.shippingCount
      });
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var self = this;
    this.GetOrderList(app.data.logininfo.user_id, this.data.orderType, 1, this.data.orderAttr, function(res) {
      self.setData({
        orderList: res.data.list,
        totalPage: res.data.totalPage,
        pageNumber: 1,
        shippingCount: res.data.shippingCount
      });
      wx.stopPullDownRefresh();
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var self = this;
    var pageNumber = self.data.pageNumber;
    if (pageNumber < self.data.totalPage) {
      this.GetOrderList(app.data.logininfo.user_id, this.data.orderType, pageNumber + 1, this.data.orderAttr, function(res) {
        self.setData({
          orderList: self.data.orderList.concat(res.data.list),
          pageNumber: pageNumber + 1,
          shippingCount: res.data.shippingCount
        });
      })
    }
  },
  goHome: function() {
    wx.switchTab({
      url: '/pages/index/index',
      success: function(e) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    })
  },
  goCollect: function() {
    wx.navigateTo({
      url: '/pages/user/collect/collect',
    })
  },
  showLogistics: function(e) {
    wx.navigateTo({
      url: '/pages/user/logistics/logistics?id=' + e.currentTarget.dataset.id,
    })
  },
  actionSheet: function(e) {
    if (this.data.actionSheetHidden) {
      this.data.orderCode = e.currentTarget.dataset.ordersn;
    } else {
      this.data.orderCode = "";
    }
    this.setData({
      //取反
      actionSheetHidden: !this.data.actionSheetHidden
    });
  },
  itemTap: function(e) {
    var self = this;
    if (e.detail.target.dataset.index == 0) {
      app.WxPay(this.data.orderCode, e.detail.formId);
    } else if (e.detail.target.dataset.index == 1) {
      self.setData({
        isAuth: false
      });
      app.OtherPay(this.data.orderCode, e.detail.formId, function(e) {
        self.setData({
          url: self.data.imgurl + e.data.list,
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
  },
  orderCancel: function(e) {
    var self = this;
    wx.showModal({
      content: '确认要取消订单吗?',
      cancelText: "确认取消",
      confirmText: "考虑一下",
      success: function(res) {
        if (!res.confirm) {
          var orderList = self.data.orderList;
          util.request(app.data.apiurl + 'api/Order/orderCancel', {
            orderId: e.currentTarget.dataset.id,
            user_id: app.data.logininfo.user_id
          }, function(res) {
            for (var i = 0; i < orderList.length; i++) {
              if (orderList[i].orderId == res.data.list.orderId) {
                orderList[i] = res.data.list;
                break;
              }
            }
            self.setData({
              orderList: orderList
            });
            wx.showToast({
              title: '取消订单成功',
            });
          }, null, true)
        }
      }
    })
  },
  orderpayclick: function(e) {

  },
  refund: function(e) {
    wx.navigateTo({
      url: '/pages/user/refund/refund?id=' + e.currentTarget.dataset.id,
    })
  }
})