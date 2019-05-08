var util = require('../../../utils/util.js');
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgurl: app.data.apiurl,
    currentStep: 0,
    stepList: ["登录", "注册"],
    inputUser: "",
    inputPassword: "",
    showModal: false,
    mobilePhone: "",
    nickName: "",
    inputMail: "",
    inputWeiXin: "",
    url: "",

    channel: [],
    selectChannel: "",

    workdate: [],
    indexWorkDate: 0,
    selectWorkDate: "",

    salenum: [],
    selectSaleNum: "",
    indexSaleNum: 0,

    infofrom: [],
    selectInfoFrom: "",
    indexInfoFrom: 0,
  },

  changeStep: function(ev) {
    var stepIndex = ev.currentTarget.dataset.stepindex;
    this.setData({
      currentStep: stepIndex
    });
  },
  bindGetUserInfo: function(e) {
    wx.login({
      success: function(res) {
        console.log('reswlogin', res)
        if (res.code) {
          util.request(app.data.apiurl + "/wechat/redirectLogin", {
            code: res.code,
            nickname: e.detail.userInfo.nickName,
            headimgurl: e.detail.userInfo.avatarUrl,
            city: e.detail.userInfo.city,
            province: e.detail.userInfo.province,
            sex: e.detail.userInfo.gender
          }, function(r) {
            console.log('res', r)
            if (r.success > 0) {
              		wx.showModal({
                    title: '登录成功',
                    content: '欢迎您，' + e.detail.userInfo.nickName,
                    showCancel: false,
                    success: function(){
                      e.detail.userInfo.openid = r.data.openid;
                      e.detail.userInfo.id = r.data.id;
                      e.detail.userInfo.mobile = r.data.mobile;
                      wx.setStorageSync(app.data.logininfokey, e.detail.userInfo);
                    if(r.data.mobile == null){
                      wx.redirectTo({
                        url: '/pages/user/forget/forget'
                      });
                    }else{
                      wx.switchTab({
                        url: '/pages/user/user'
                      });
                    }
                    }
                  })
            } else {
               
            }
          });
        }
      }
    });
  },
  inputUser: function(e) {
    this.data.inputUser = e.detail.value;
  },
  inputPassword: function(e) {
    this.data.inputPassword = e.detail.value;
  },
  inputMail: function(e) {
    this.data.inputMail = e.detail.value;
  },
  inputWeiXin: function(e) {
    this.data.inputWeiXin = e.detail.value;
  },
  UserLogin: function(e) {
    if (e.detail.userInfo) {
      if (this.data.inputUser == "") {
        util.showErrorModal("用户名不能为空");
        return;
      }
      if (this.data.inputPassword == "") {
        util.showErrorModal("密码不能为空");
        return;
      }
      
      this.bindGetUserInfo(e);

    }
  },
  
  /**
   * 弹窗
   */
  showMobileDialog: function() {
    this.setData({
      showModal: true
      //currentStep: 1
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function() {},
  /**
   * 隐藏模态对话框
   */
  hideModal: function() {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function() {
    this.hideModal();
  },
  inputChange: function(e) {
    this.data.mobilePhone = e.detail.value;
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function() {
    this.hideModal();
    var self = this;
    self.setData({
      currentStep: 1
    });
 
  },
  onBack: function() {
    this.setData({
      currentStep: 0
    });
  },

  onLoad: function(e) {
    if (app.isLogin()) {
      wx.switchTab({
        url: "/pages/index/index",
      })
    }
    if (e.url != undefined) {
      this.setData({
        url: e.url
      });
    }
  }
})