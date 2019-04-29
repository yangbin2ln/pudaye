var util = require('../../utils/util.js');
var filter = require('../../utils/filter.js');
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
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
  goGoods: function(event) {
    if (event.currentTarget.dataset.name.indexOf('活动') != -1) {
      this.setData({
        brandSelect: [],
        categorySelect: [],
        attrSelect: [],
        keywords: "",
        hottype: "",
        hottypeName: "",
        Select: [],
        isPromote: true,
        ishaveSelect: true,
        adName: event.currentTarget.dataset.name
      });
      this.getGoodsInfo(true);
      return;
    }
    if (event.currentTarget.dataset.goodssn != "") {
      wx.navigateTo({
        url: '/pages/goods/goods?goodssn=' + event.currentTarget.dataset.goodssn
      })
    }
  },
  selectSort: function(event) {
    var sort_selected = event.currentTarget.dataset.sort_index;
    if (sort_selected == 3) {
      if (this.data.isShowFilter) {
        return;
      }
      this.setData({
        isShowFilter: !this.data.isShowFilter,
      });
    } else {
      var order = "ASC";
      if (sort_selected == this.data.sort_selected) {
        if (this.data.order == "ASC") {
          order = "DESC";
        }
      }
      this.setData({
        sort_selected: sort_selected,
        order: order
      });
      this.getGoodsInfo(true);
    }
  },
  getGoodsInfo: function(isFirst, callBack) {
    var self = this;
    if (isFirst) {
      self.setData({
        goods_message: [],
        pageNumber: 1,
      })
    } else {
      self.setData({
        pageNumber: this.data.pageNumber + 1,
      })
    }

    var categorySelect = "";
    for (var key in this.data.categorySelect) {
      if (this.data.categorySelect[key] != undefined) {
        categorySelect = categorySelect + "," + key;
      }
    }

    var brandSelect = "";
    for (var key in this.data.brandSelect) {
      if (this.data.brandSelect[key] != undefined) {
        brandSelect = brandSelect + "," + key;
      }
    }
    util.request(
      app.data.apiurl + 'api/Search/GetGoodsEx', {
        attrSelect: this.data.attrSelect.join(","),
        categorySelect: categorySelect,
        brandSelect: brandSelect,
        keywords: this.data.keywords,
        hottype: this.data.hottype,
        sort: this.data.sort_selected,
        order: this.data.order,
        pageNumber: this.data.pageNumber,
        isPromote: this.data.isPromote
      },
      function(res) {
        self.setData({
          goods_message: self.data.goods_message.concat(res.data.list),
          totalPage: res.data.totalPage,
          isShowFilter: false
        });
        if (typeof callBack == "function") {
          callBack();
        }
      }, "get", true
    );
  },
  goodboxclick: function(e) {
    var goods_id = e.currentTarget.dataset.goodsid;
    var price = e.currentTarget.dataset.price;
    if (price == undefined) {
      price = "";
    }
    wx.navigateTo({
      url: '/pages/goods/goods?id=' + goods_id + "&price=" + price
    })
  },
  scancode: function() {
    wx.scanCode({
      success: function(res) {
        var goods_sn = res.result;
        wx.navigateTo({
          url: '/pages/goods/goods?goodssn=' + goods_sn
        })
      },
      fail: function(res) {
        console.log(res)
      }
    })
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

  execadd: function(e) {

    // 检查是否已经登录
    if (!app.loginCheck()) {
      return;
    }
    var self = this;
    // 加入购物车
    var obj = {};
    // 会员id
    obj.user_id = app.data.logininfo.user_id;
    obj.goods_number = 1;
    obj.goods_id = e.currentTarget.dataset.id;
    obj.price = e.currentTarget.dataset.price;

    util.request(
      app.data.apiurl + 'api/Goods/AddToCartByPrice',
      obj,
      function() {
        app.getCartCount(function(e) {
          self.setData({
            CartCount: e
          });
        });
      }
    );
  },

  searchtop: function(e) {

    this.data.keywords = this.data.searchtop;
    if (this.data.keywords == undefined) {
      this.data.keywords = "";
    }
    this.getGoodsInfo(true);
  },
  categoryClick: function(e) {
    var categorySelect = this.data.categorySelect;
    if (categorySelect[e.currentTarget.dataset.id] == undefined) {
      categorySelect[e.currentTarget.dataset.id] = e.currentTarget.dataset.name;
    } else {
      categorySelect[e.currentTarget.dataset.id] = undefined;
    }
    this.setData({
      categorySelect: categorySelect,
    });
  },

  brandClick: function(e) {
    var brandSelect = this.data.brandSelect;
    if (brandSelect[e.currentTarget.dataset.id] == undefined) {
      brandSelect[e.currentTarget.dataset.id] = e.currentTarget.dataset.name;
    } else {
      brandSelect[e.currentTarget.dataset.id] = undefined;
    }
    this.setData({
      brandSelect: brandSelect,
    });
  },
  attrClick: function(e) {
    var attrSelect = this.data.attrSelect;
    if (attrSelect[e.currentTarget.dataset.id] == undefined) {
      attrSelect = [];
      attrSelect[e.currentTarget.dataset.id] = e.currentTarget.dataset.name;
    } else {
      attrSelect = [];
    }
    this.setData({
      attrSelect: attrSelect,
    });
  },
  restButton: function(e) {
    this.setData({
      brandSelect: [],
      categorySelect: [],
      attrSelect: [],
      keywords: "",
      hottype: "",
      hottypeName: "",
      Select: [],
      isPromote: false,
      ishaveSelect: false
    });
    this.getGoodsInfo(true);
  },
  filtersubmit: function(e) {
    this.setData({
      isPromote: false
    });
    this.getSelect();
    this.getGoodsInfo(true)
  },

  getSelect: function() {
    var ishaveSelect = false;
    for (var key in this.data.categorySelect) {
      if (this.data.categorySelect[key] != undefined) {
        ishaveSelect = true;
        break;
      }
    }
    if (!ishaveSelect) {
      for (var key in this.data.brandSelect) {
        if (this.data.brandSelect[key] != undefined) {
          ishaveSelect = true;
          break;
        }
      }
    }
    if (!ishaveSelect) {
      for (var key in this.data.attrSelect) {
        if (this.data.attrSelect[key] != undefined) {
          ishaveSelect = true;
          break;
        }
      }
    }
    if (!ishaveSelect) {
      if (this.data.hottype != undefined && this.data.hottype != "") {
        ishaveSelect = true;
      }
    }
    this.setData({
      ishaveSelect: ishaveSelect
    });
  },
  goTop: function(e) {
    this.setData({
      scrollTop: 0
    });
  },

  selectClick: function(e) {
    var arr = [];
    if (e.currentTarget.dataset.type == "1") {
      arr = this.data.attrSelect;
      arr[e.currentTarget.dataset.id] = undefined;
      this.setData({
        attrSelect: arr
      });
    } else if (e.currentTarget.dataset.type == "2") {
      arr = this.data.categorySelect;
      arr[e.currentTarget.dataset.id] = undefined;
      this.setData({
        categorySelect: arr
      });
    } else if (e.currentTarget.dataset.type == "3") {
      arr = this.data.brandSelect;
      arr[e.currentTarget.dataset.id] = undefined;
      this.setData({
        brandSelect: arr
      });
    }
    this.getSelect();
    this.getGoodsInfo(true)
  },
  selectClickHot: function() {
    this.setData({
      hottype: "",
      hottypeName: ""
    });
    this.getSelect();
    this.getGoodsInfo(true)
  },

  more: function(e) {
    var self = this;
    if (e.currentTarget.dataset.type == "1") {
      util.request(app.data.apiurl + 'api/Category/GetCategory', {}, function(res) {
        self.setData({
          list: res.data.list,
          categoryshowMore: true,
          isShowFilter: false
        });
      });
    } else {
      util.request(app.data.apiurl + 'api/Common/GetBrand', {}, function(res) {
        self.setData({
          list: res.data.list,
          brandshowMore: true,
          isShowFilter: false
        });
      });
    }
  },
  selectok: function() {
    this.setData({
      isShowFilter: true,
      categoryshowMore: false,
      brandshowMore: false
    });
  },
  preventD() {
    return
  },
  touchOnGoods: function(e) {
    // 检查是否已经登录
    var self = this;
    if (!app.loginCheck()) {
      return;
    }
    this.finger = {};
    var topPoint = {};
    this.finger['x'] = e.touches["0"].clientX; //点击的位置
    this.finger['y'] = e.touches["0"].clientY;

    if (this.finger['y'] < this.busPos['y']) {
      topPoint['y'] = this.finger['y'] - 150;
    } else {
      topPoint['y'] = this.busPos['y'] - 150;
    }

    if (this.finger['x'] > this.busPos['x']) {
      topPoint['x'] = (this.finger['x'] - this.busPos['x']) / 2 + this.busPos['x'];
    } else { //
      topPoint['x'] = (this.busPos['x'] - this.finger['x']) / 2 + this.finger['x'];
    }
    this.linePos = app.CreateBezierPoints([this.busPos, topPoint, this.finger], 30);
    this.startAnimation(e);
  },
  startAnimation: function(e) {
    if (!this.data.hide_good_box) {
      return;
    }
    var index = 0,
      that = this,
      bezier_points = that.linePos['bezier_points'];

    this.setData({
      hide_good_box: false,
      bus_x: that.finger['x'],
      bus_y: that.finger['y']
    })
    var len = bezier_points.length;
    index = len
    this.timer = setInterval(function() {
      index--;
      that.setData({
        bus_x: bezier_points[index]['x'],
        bus_y: bezier_points[index]['y']
      })
      if (index < 1) {
        clearInterval(that.timer);
        that.execadd(e);
        that.setData({
          hide_good_box: true
        })
      }
    }, 30);
  },
  scroll: function(e) {
    if (!this.data.isShowFilter && !this.data.brandshowMore && !this.data.categoryshowMore) {
      if (e.detail.scrollTop > 525) {
        this.setData({
          fixfilter: true
        });
      } else {
        this.setData({
          fixfilter: false
        });
      }
    }
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
  selectPromote: function() {
    this.setData({
      isPromote: false,
      ishaveSelect: false
    });
  },
  onLoad: function() {
    this.busPos = {};
    this.busPos['x'] = 245; //购物车的位置
    this.busPos['y'] = app.data.hh;
    var self = this;
    //轮播广告信息取得
    util.request(
      app.data.apiurl + 'api/Index/GetAdsInfo', {},
      function(res) {
        var datalista = res.data.list;
        self.setData({
          imgUrls: datalista
        });
      }
    );
    var attrSelect = [];
    var categorySelect = [];
    var brandSelect = [];
    if (app.data.categorySelect != undefined && app.data.categorySelect != "") {
      categorySelect[app.data.categorySelect] = app.data.categorySelectName;
      app.data.categorySelect = undefined;
      app.data.categorySelectName = undefined;
    }

    if (app.data.brandSelect != undefined && app.data.brandSelect != "") {
      brandSelect[app.data.brandSelect] = app.data.brandSelectName;
      app.data.brandSelect = undefined;
      app.data.brandSelectName = undefined;
    }
    var keywords = "";
    if (app.data.keywords != undefined && app.data.keywords != "") {
      keywords = app.data.keywords;
      app.data.keywords = undefined;
    }
    var hottype = "";
    var hottypeName = "";
    if (app.data.hottype != undefined && app.data.hottype != "") {
      hottype = app.data.hottype;
      hottypeName = app.data.hottypeName;

      app.data.hottype = undefined;
      app.data.hottypeName = undefined;
    }

    self.setData({
      categorySelect: categorySelect,
      brandSelect: brandSelect,
      attrSelect: attrSelect,
      keywords: keywords,
      hottype: hottype,
      hottypeName: hottypeName
    });
    this.getSelect();
    this.getGoodsInfo(true);
    filter.initFilter(function(res) {
      self.setData({
        attrList: res.data.goodsAtr,
        categoryList: res.data.category,
        Brand: res.data.brand,
      });
    });
    self.setData({
      isLogin: app.isLogin()
    });
    app.getCartCount();
    util.request(app.data.apiurl + 'api/Pay/GetPayType', {}, function(res) {
      app.data.actionSheetItems = res.data.name;
      app.data.actionSheetIcon = res.data.type;
      app.data.actionSheetCode = res.data.payCode;
    });

  },
  selectAttr: function(e) {
    var attrSelect = [];
    if (e.currentTarget.dataset.index == 0) {
      attrSelect[0] = "上海仓现货"
      attrSelect[1] = "深圳仓现货"
    } else {
      attrSelect[0] = "日本仓直邮"
    }

    this.setData({
      brandSelect: [],
      categorySelect: [],
      attrSelect: attrSelect,
      keywords: "",
      hottype: "",
      hottypeName: "",
      isPromote: false,
      ishaveSelect: true
    });
    this.getGoodsInfo(true);
  },
  onShow: function() {
    var logininfo = wx.getStorageSync(app.data.logininfokey);
    var is_validated = "0";
    if (logininfo == '' || logininfo == undefined || logininfo.user_id == '' || logininfo.is_validated == undefined) {
      is_validated = "0";
    } else {
      is_validated = logininfo.is_validated
    }

    this.setData({
      is_validated: is_validated,
      isLogin: app.isLogin()
    });

    var self = this;
    if (this.data.isLogin) {
      util.request(app.data.apiurl + 'api/Order/GetOrderList', {
        user_id: app.data.logininfo.user_id,
        orderType: "",
        pageNumber: 1,
        orderAttr: "0"
      }, function(res) {
        if (res.data.shippingCount > 0) {
          wx.showModal({
            content: '你有未支付的运费订单，请先去支付',
            cancelText: "算了吧",
            confirmText: "去支付",
            success: function(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/user/shippingpay/shippingpay',
                })
              }
            }
          })
        }
      }, null, true)
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (!this.data.isShowFilter &&
      !this.data.brandshowMore &&
      !this.data.categoryshowMore) {
      this.getGoodsInfo(false);
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    if (!this.data.isShowFilter &&
      !this.data.brandshowMore &&
      !this.data.categoryshowMore) {
      this.getGoodsInfo(true, function() {
        wx.stopPullDownRefresh();
      });
    } else {
      wx.stopPullDownRefresh();
    }
  },
  onShareAppMessage: function(e) {
    wx.showShareMenu();
  },
})