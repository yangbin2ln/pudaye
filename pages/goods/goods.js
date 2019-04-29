var util = require('../../utils/util.js');
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    chooseSize: false,
    animationData: {},
    id: '',
    scrollTop: 0,
    floorstatus: false,
    modalHidden: false,
    // 轮播
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    imgurl: app.data.imgurl,
    goodsimgurl: app.data.goodsimgurl,
    //名称
    goodsid: '',
    goods_name: '',
    goods_sn: '',
    goodimg: [],
    goodimgdetail: '',
    sales_volume_base: 0,
    goodsattr: '',
    goodsprice: "",

    numa: 1,
    scrollLength: 0,
    modalHidden: true,
    modalHidden2: true,
    collect: false,
    imgUrls: [],
    goodsNumber: 0,
    atrList: [],
    general_price: "",
    general_pricejp: "",

    isLogin: false,
    is_validated: 0,
    new_presell_num: 0,
    new_presell_date: "",
    goodimgShow: []
  },
  numInput: function (e) {
    this.data.numa = e.detail.value;
  },
  ImageShowOnError: function (event) {
    this.data.goodimgShow[event.currentTarget.dataset.index] = false;
    this.setData({
      goodimgShow: this.data.goodimgShow
    });
  },
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  chooseSezi: function () {
    // 用that取代this，防止不必要的情况发生
    var that = this;
    // 创建一个动画实例
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 500,
      // 定义动画效果，当前是匀速
      timingFunction: 'linear'
    })
    // 将该变量赋值给当前动画
    that.animation = animation
    // 先在y轴偏移，然后用step()完成一个动画
    animation.translateY(200).step()
    // 用setData改变当前动画
    that.setData({
      // 通过export()方法导出数据
      animationData: animation.export(),
      // 改变view里面的Wx：if
      chooseSize: true
    })
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 200)
  },
  hideModal: function (e) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(200).step()
    that.setData({
      animationData: animation.export()

    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        chooseSize: false
      })
    }, 200)
  },

  //tab点击事件，刷新数据
  reflashData: function (event) {
    var that = this
    console.log(event)
    var index = event.currentTarget.dataset.index
    //移动view位置，改变选中颜色
    this.initData(index)
  },
  //初始化数据
  initData: function (index) {
    var that = this
    this.setData({
      modalHidden: false,
      curIndex: index,
      curText: that.data.listTab[index].text,
    })
  },
  goTop: function (e) {
    this.setData({
      scrollTop: 0
    })
  },
  scroll: function (e) {
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
  addtocart: function () {
    // 检查是否已经登录
    if (!app.loginCheck()) {
      return;
    }
    if (this.CheckNum()) {
      this.execadd(false);
      this.chooseSezi();
    }
  },
  execadd: function (isGoCart) {
    // 加入购物车
    var obj = {};
    // 会员id
    obj.user_id = app.data.logininfo.user_id;
    obj.goods_number = this.data.numa;
    obj.goods_id = this.data.goodsid;
    obj.goods_attr = this.data.goodsattr

    util.request(
      app.data.apiurl + 'api/Goods/AddToCart',
      obj,
      function () {
        if (isGoCart) {
          wx.switchTab({
            url: '../cart/cart'
          });
        }
      }, 'POST', true
    );
  },
  buynow: function () {
    // 检查是否已经登录
    if (!app.loginCheck()) {
      return;
    }
    if (this.CheckNum()) {
      this.execadd(true);
    }
  },
  modalChange: function (e) {
    this.setData({
      modalHidden: true
    })
  },
  modalTap2: function (e) {
    this.setData({
      modalHidden2: false
    })
  },
  modalChange2: function (e) {
    this.setData({
      modalHidden2: true
    })
  },
  numdel: function (e) {

    var numnew = this.GetNum() - 1;
    if (numnew == 0) {
      numnew = 1;
    };
    this.setData({
      numa: numnew
    })
  },
  numadd: function (e) {
    var numnew = this.GetNum() + 1
    if (numnew > 9999) {
      numnew = 9999;
    }
    this.setData({
      numa: numnew
    })
  },
  gotoindex: function () {
    wx.switchTab({
      url: '../index/index'
    })
    app.getCartCount();
  },
  gotocart: function () {
    wx.switchTab({
      url: '../cart/cart'
    })
  },

  serviceSelection(e) {
    this.setData({
      goodsattr: e.currentTarget.dataset.attr
    });
    this.getGoodsInfo(this.data.goodsid, this.data.goodsSn)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      isLogin: app.isLogin()
    });
    app.getCartCount();
    var that = this;
    var goodsId = options.id == undefined ? '' : options.id;
    var goodsSn = options.goodssn == undefined ? '' : options.goodssn;

    if (options.isscancode != undefined) {
      this.setData({
        isscancode: options.isscancode
      });
    }

    if (options.attr != undefined) {
      this.setData({
        goodsattr: options.attr
      });
    } else {
      this.setData({
        goodsattr: ""
      });
    }
    if (options.price != undefined) {
      this.setData({
        goodsprice: options.price
      });
    } else {
      this.setData({
        goodsprice: ""
      });
    }

    if (goodsId != "") {
      this.setData({
        goodsid: goodsId
      });
    }
    //商品详情取得
    this.getGoodsInfo(goodsId, goodsSn)  
  },
  GetNum: function () {
    var numa = this.data.numa;
    if (isNaN(parseInt(numa))) {
      numa = 1;
    } else {
      numa = parseInt(numa);
    }
    if (numa < 1) {
      numa = 1;
    }
    this.setData({
      numa: numa
    });
    return numa;
  },
  CheckNum: function () {
    if (isNaN(parseInt(this.data.numa))) {
      wx.showToast({
        title: '请输入数字',
      })
      return false;
    } else if (parseInt(this.data.numa) <= 0) {
      wx.showToast({
        title: '输入不正确',
      })
      return false;
    }
    this.GetNum();
    return true;
  },
  onShow: function () {
    if (app.data.logininfo.is_validated != undefined) {
      this.setData({
        is_validated: app.data.logininfo.is_validated
      });
    }
  }
})