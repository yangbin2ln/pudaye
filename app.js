//app.js
var util = require('/utils/util.js');
App({
  data: {
    projectName: "铺大爷",
    logininfokey: "logininfo",
    logininfo: {
      user_id: '',
      user_name: '',
      user_rank: '',
      discount: 0,
      is_validated: "0"
    },
    isSelectAddress: false,
    id: "",
    childid: "",
    isShow: false,
    actionSheetItems: [],
    actionSheetCode: [],
    actionSheetIcon: [],
    isPreviewImage: false,
    ww: 0,
    hh: 0,


    categorySelect: "",
    categorySelectName: "",
    brandSelect: "",
    brandSelectName: "",
    keywords: "",
    hottype: "",
    hottypeName: "",
  },
  onLaunch: function() {
    var that = this;
    wx.getSystemInfo({ //  获取页面的有关信息
      success: function(res) {
        var ww = res.windowWidth;
        var hh = res.windowHeight;
        that.data.ww = ww;
        that.data.hh = hh;
      }
    });
    const updateManager = wx.getUpdateManager();
    wx.getUpdateManager().onUpdateReady(function() {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
  },
  isLogin: function() {
    var logininfo = wx.getStorageSync(this.data.logininfokey);
    this.data.logininfo = logininfo;
    if (logininfo == '' || logininfo == undefined || logininfo.user_id == '') {
      return false;
    } else {
      return true;
    }
  },
  loginCheck: function(url) {
    if (url == undefined) {
      url = "";
    }
    
    return true;
  },
  getCartCount: function(callback) {
    var that = this;
    if (that.data.logininfo.user_id == undefined) {
      wx.removeTabBarBadge({
        index: 2,
      });
      return;
    }
    if (this.data.logininfo.user_id != undefined && this.data.logininfo.user_id != '') {
      util.request(that.data.apiurl + 'api/Index/GetCartCount', {
        user_id: that.data.logininfo.user_id
      }, function(res) {
        var cnt = res.data.list;
        if (cnt === 0) {
          wx.removeTabBarBadge({
            index: 2,
          });
        } else {
          wx.setTabBarBadge({
            index: 2,
            text: cnt + ''
          });
        }
        if (callback != undefined) {
          callback(cnt);
        }
      });
    }
  },
  WxPay: function(orderCode, formId) {
    wx.navigateToMiniProgram({
      appId: 'wx1ec0ed192980dc5b',
      path: '/pages/pay/pay?type=1&orderCode=' + orderCode + "&formId=" + formId,
      envVersion: "trial",
      success(res) {
        // 打开成功
      }
    })
  },
  WxPayEx: function(orderCode, formId) {
    var self = this;
    wx.login({
      success: function(res) {
        if (res.code) {
          util.request(self.data.apiurl2 + "api/Pay/GetUnifiedOrderResultByGlobePayEx", {
            code: res.code,
            orderCode: orderCode
          }, function(e) {
            var obj = e.data.list.sdk_params;
            wx.requestPayment({
              'timeStamp': obj.timeStamp,
              'nonceStr': obj.nonceStr,
              'package': obj.package,
              'signType': obj.signType,
              'paySign': obj.paySign,
              'success': function(res) {
                util.request(self.data.apiurl2 + "api/Pay/UpdataOrder", {
                  orderCode: orderCode,
                  form_id: formId
                }, function(e) {
                  util.showErrorModal(e.data.list, function() {
                    wx.navigateBackMiniProgram({})
                  });
                });
              },
              'fail': function(res) {
                wx.navigateBackMiniProgram({})
              }
            })
          });
        }
      }
    });
  },
  OtherPay: function(orderCode, formId, callBack) {
    var self = this;
    util.request(self.data.apiurl + "api/Pay/GetImage", {
      orderCode: orderCode,
      formId: formId
    }, callBack);
  },
  WxPayShippping: function(ShippingNO, formId) {
    wx.navigateToMiniProgram({
      appId: 'wx1ec0ed192980dc5b',
      path: '/pages/pay/pay?type=1&orderCode=' + orderCode + "&formId=" + formId,
      envVersion: "trial",
      success(res) {
        // 打开成功
      }
    })
  },

  WxPayShipppingEx: function(ShippingNO, formId) {
    var self = this;
    wx.login({
      success: function(res) {
        if (res.code) {
          util.request(self.data.apiurl2 + "api/Pay/GetUnifiedOrderResultByGlobePayWithShipppingEx", {
            code: res.code,
            ShippingNO: ShippingNO
          }, function(e) {
            var obj = e.data.list.sdk_params;
            wx.requestPayment({
              'timeStamp': obj.timeStamp,
              'nonceStr': obj.nonceStr,
              'package': obj.package,
              'signType': obj.signType,
              'paySign': obj.paySign,
              'success': function(res) {
                util.request(self.data.apiurl2 + "api/Pay/UpdataOrderByGlobePayWithShippping", {
                  ShippingNO: ShippingNO,
                  form_id: formId
                }, function(e) {
                  wx.navigateBackMiniProgram({})
                });
              },
              'fail': function(res) {
                wx.navigateBackMiniProgram({})
              }
            })
          });
        }
      }
    });
  },

  OtherPayShippping: function(ShippingNO, formId, callBack) {
    var self = this;
    util.request(self.data.apiurl + "api/Pay/GetImageShippping", {
      ShippingNO: ShippingNO,
      formId: formId
    }, callBack);
  },
  CreateBezierPoints: function(anchorpoints, pointsAmount) {
    var points = [];
    for (var i = 0; i < pointsAmount; i++) {
      var point = MultiPointBezier(anchorpoints, i / pointsAmount);
      points.push(point);
    }

    function MultiPointBezier(points, t) {
      var len = points.length;
      var x = 0,
        y = 0;
      var erxiangshi = function(start, end) {
        var cs = 1,
          bcs = 1;
        while (end > 0) {
          cs *= start;
          bcs *= end;
          start--;
          end--;
        }
        return (cs / bcs);
      };
      for (var i = 0; i < len; i++) {
        var point = points[i];
        x += point.x * Math.pow((1 - t), (len - 1 - i)) * Math.pow(t, i) * (erxiangshi(len - 1, i));
        y += point.y * Math.pow((1 - t), (len - 1 - i)) * Math.pow(t, i) * (erxiangshi(len - 1, i));
      }
      return {
        x: x,
        y: y
      };
    }
    return {
      'bezier_points': points
    };
  },
  IsValidated: function(callBack) {
    var that = this;
    if (this.data.logininfo.user_id != undefined && this.data.logininfo.user_id != '') {
      util.request(that.data.apiurl + 'api/Index/GetIsValidated', {
          user_id: that.data.logininfo.user_id
        },
        function(res) {
          var cnt = res.data.list;

          that.data.logininfo.is_validated = cnt;
          wx.setStorageSync(that.data.logininfokey, that.data.logininfo);
          if (cnt === 0) {
            util.showErrorModal("您的账户没有激活，请联系客服激活！");
          }
          callBack(cnt);
        }
      );
    }
  },
  viewImg: function(e){
    const querySel = e.target.dataset.preimg;
    wx.createSelectorQuery().selectAll(querySel).boundingClientRect(function(rect){
      let urls=[];
      for(let i=0;i<rect.length;i++){
        if(rect[i].dataset.src){
          urls[i] = rect[i].dataset.src
        }
      }
      wx.previewImage({
        current: e.target.dataset.src, // 当前显示图片的http链接
        urls: urls // 需要预览的图片http链接列表
      })
     }).exec()
  }
})