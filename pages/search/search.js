var util = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl: app.data.imgurl, //上传图片后修改此处
    goodsimgurl: app.data.goodsimgurl,
    menu_group: [],
    sort_group: ['销量', '综合', '人气', '价格'],
    indicatorDots: true,
    interval: 2000,
    autoplay: true,
    search: "请输入商品名称或条形码查询",
    curIndex: 0,
    curText: null,
    scrollLength: 0,
    scrollTop: 0,
    floorstatus: false,
    CartCount: 0,

    goods_box_width03: 240, //3列并排的大小
    goods_box_width02: 360, //2列并排的尺寸
    goods_box_width01: 750, //1列并排的尺寸

    sort_selected: 0,
    order: "ASC",

    goods_message: [],
    limitcnt: 10,
    iconsindex: 1,
    iconsimg: [{
        id: 1,
        img: "icon-ge1"
      },
      {
        id: 2,
        img: "icon-ge"
      }
    ],
    formtype: true,
    formtype2: false,
    keywords: '',
    brandid: '',
    catid: "",
    hottype: "",
    hide_good_box: true,
    fenleibannerImg: [],
    goodsAtr:[],

    // 当前页
    pageNumber: 1,
    // 总页数
    totalPage: 1,
    isLogin: false,
  },
  onLoad: function(options) {
    var self = this;
    this.busPos = {};
    this.busPos['x'] = 100; //购物车的位置
    this.busPos['y'] = app.data.hh;
    app.getCartCount(function(e) {
      self.setData({
        CartCount: e
      });
    });
    this.data.keywords = options.keywords;
    this.data.brandid = options.brandid;
    this.data.catid = options.catid;
    this.data.hotType = options.options;
    if (options.hottype == undefined) {
      this.data.hottype = "";
    } else {
      this.data.hottype = options.hottype;
    }
    if (this.data.keywords == undefined) {
      this.data.keywords = '';
    }
    if (this.data.brandid == undefined) {
      this.data.brandid = '';
    }
    if (this.data.catid == undefined) {
      this.data.catid = '';
    }

    if (this.data.hotType == undefined) {
      this.data.hotType = '';
    }


    var that = this
    that.setData({
      menu_group: [],
      scroll_banner: [],
      keywords: this.data.keywords,
      brandid: this.data.brandid,
      hottype: this.data.hottype,
      catid: this.data.catid,
      isLogin: app.isLogin()
    });
    this.getGoodsInfo(true);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.getGoodsInfo(false);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getGoodsInfo(true, function() {
      wx.stopPullDownRefresh();
    });
  },
  execadd: function(e) {
    var self = this;
    // 加入购物车
    var obj = {};
    // 会员id
    obj.user_id = app.data.logininfo.user_id;
    obj.goods_number = 1;
    obj.goods_id = e.currentTarget.dataset.id;
    obj.goods_attr = '日本仓直邮';

    util.request(
      app.data.apiurl + 'api/Goods/AddToCart',
      obj,
      function() {
        app.getCartCount(function(e) {
          self.setData({
            CartCount: e
          });
        });
      }, 'POST'
    );
  },
  scancode: function() {
    wx.scanCode({
      success: function(res) {
        var goods_sn = res.result;
        wx.navigateTo({
          url: '../goods/goods?goodssn=' + goods_sn
        })
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
    if (this.data.searchtop != '') {
      this.data.keywords = this.data.searchtop;
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
    util.request(
      app.data.apiurl + 'api/Search/GetGoods', {
        hottype: this.data.hottype,
        keywords: this.data.keywords,
        brandid: this.data.brandid,
        catid: this.data.catid,
        sort: this.data.sort_selected,
        order: this.data.order,
        pageNumber: this.data.pageNumber,
        goodsAtr: this.data.goodsAtr
      },
      function(res) {
        self.setData({
          goods_message: self.data.goods_message.concat(res.data.list),
          totalPage: res.data.totalPage,
        });
        if (typeof callBack == "function") {
          callBack();
        }
      }, "get", true
    );
  },
  selectSort: function(event) {
    var sort_selected = event.currentTarget.dataset.sort_index;
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
  },
  initData: function(index) {
    var that = this
    this.setData({
      curIndex: index,
      curText: that.data.listTab[index].text,
    })
  },
  goodboxclick: function(e) {
    var goods_id = e.currentTarget.dataset.goodsid
    wx.navigateTo({
      url: '../goods/goods?id=' + goods_id
    })
  },
  icons: function() {
    if (this.data.iconsindex == 2) {
      this.data.iconsindex = 1;
    } else {
      this.data.iconsindex = this.data.iconsindex + 1;
    }
    this.setData({
      iconsindex: this.data.iconsindex
    })
  },
  goTop: function(e) {
    this.setData({
      scrollTop: 0
    })
  },
  scroll: function(e) {
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
  gotocart: function() {
    wx.switchTab({
      url: '/pages/cart/cart',
    })
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
    topPoint['x'] = Math.abs(this.finger['x'] - this.busPos['x']) / 2;

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
})