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
    var self = this;
    if (e.detail.userInfo) {
		wx.showModal({
		  title: '登录成功',
		  content: '欢迎您，' + e.detail.userInfo.nickName,
		  showCancel: false,
		  success: function(){
			wx.switchTab({
				  url: '/pages/index/index'
				});
			wx.setStorageSync(app.data.logininfokey, e.detail.userInfo);
		  }
		})
		 
     /* wx.login({
        success: function(res) {
          if (res.code) {
            self.data.nickName = e.detail.userInfo.nickName;
            util.request(app.data.apiurl + "api/Index/WeixinLogin", {
              code: res.code,
              nickName: e.detail.userInfo.nickName
            }, function(e) {
              if (e.data.list.length > 0) {
                self.LoginOk(e);
              } else {
                self.showMobileDialog();
                // self.setData({
                //   currentStep: 1
                // });

                self.GetDataDictionary('03');
                self.GetDataDictionary('04');
                self.GetDataDictionary('05');
                self.GetDataDictionary('06');
              }
            });
          }
        }
      });*/
    } else {
      wx.showModal({
        title: "提示",
        content: "用户授权失败，请授权",
        showCancel: false
      });
    }

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
      var self = this;
      wx.login({
        success: function(res) {
          if (res.code) {
            util.request(app.data.apiurl + "api/Index/Login", {
              code: res.code,
              userid: self.data.inputUser,
              password: self.data.inputPassword
            }, function(e) {
              if (e.data.list.length > 0) {
                self.LoginOk(e);
              } else {
                wx.showModal({
                  title: "提示",
                  content: "用户名密码不正确，请重新输入。",
                  showCancel: false
                });
              }
            });
          }
        }
      });
    } else {
      wx.showModal({
        title: "提示",
        content: "用户授权失败，请授权",
        showCancel: false
      });
    }
  },
  LoginOk: function(e) {
    var self = this;
    wx.showModal({
      title: "提示",
      content: "登陆成功",
      showCancel: false,
      success: function(res) {
        var logininfo = {};
        logininfo.user_id = e.data.list[0].user_id;
        logininfo.user_name = e.data.list[0].user_name;
        logininfo.user_rank = e.data.list[0].user_rank;
        logininfo.is_validated = e.data.list[0].is_validated;
        app.data.logininfo = logininfo;
        wx.setStorageSync(app.data.logininfokey, app.data.logininfo);
        if (self.data.url == "" || self.data.url == undefined) {
          var pages = getCurrentPages();
          if (pages.length > 1) {
            wx.navigateBack({
              delta: 1
            });
          } else {
            wx.switchTab({
              url: "/pages/index/index"
            });
          }
        } else {
          wx.switchTab({
            url: self.data.url,
          });
        }

      }
    });
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

    // wx.login({
    //   success: function (res) {
    //     if (res.code) {
    //       util.request(app.data.apiurl + "api/Index/RegisterWeixin", {
    //         code: res.code,
    //         nickName: self.data.nickName,
    //         mobilePhone: self.data.mobilePhone
    //       }, function (e) {
    //         if (e.data.list.length > 0) {
    //           self.LoginOk(e);
    //         } else {
    //           self.showMobileDialog();
    //         }
    //       });
    //     }
    //   }
    // });
  },
  onBack: function() {
    this.setData({
      currentStep: 0
    });
  },
  onRegister: function() {
    var self = this;
    if (self.data.inputUser == "") {
      util.showErrorModal("用户名不能为空");
      return;
    }

    if (self.data.inputPassword == "") {
      util.showErrorModal("密码不能为空");
      return;
    }

    if (self.data.inputMail == "") {
      util.showErrorModal("电子邮件地址不能为空");
      return;
    } else if (!util.isEmail(self.data.inputMail)) {
      util.showErrorModal("您输入的电子邮件地址格式不正确！");
      return;
    }

    if (self.data.mobilePhone == "") {
      util.showErrorModal("手机号不能为空");
      return;
    }

    if (isNaN(parseInt(self.data.mobilePhone))) {
      util.showErrorModal("手机号不正确");
      return;
    }
    if (self.data.inputWeiXin == "") {
      util.showErrorModal("微信号不能为空");
      return;
    }

    if (self.data.selectChannel == "") {
      util.showErrorModal("请选择销售渠道");
      return;
    }

    if (self.data.selectWorkDate == "") {
      util.showErrorModal("请选择从业时间");
      return;
    }

    if (self.data.selectSaleNum == "") {
      util.showErrorModal("请选择月销量");
      return;
    }

    if (self.data.selectInfoFrom == "") {
      util.showErrorModal("请选择消息来源");
      return;
    }

    wx.login({
      success: function(res) {
        if (res.code) {
          util.request(app.data.apiurl + "api/Index/RegisterUser", {
            code: res.code,
            nickName: self.data.nickName,
            user: self.data.inputUser,
            password: self.data.inputPassword,
            mail: self.data.inputMail,
            mobilePhone: self.data.mobilePhone,
            weixin: self.data.inputWeiXin,
            channel: self.data.selectChannel,
            workdate: self.data.selectWorkDate,
            salenum: self.data.selectSaleNum,
            infofrom: self.data.selectInfoFrom
          }, function(e) {
            if (e.data.list.length > 0) {
              self.LoginOk(e);
            } else {
              self.showMobileDialog();
            }
          });
        }
      }
    });
  },

  checkboxChange: function(e) {
    this.setData({
      selectChannel: e.detail.value,
    });
  },
  bindWorkdateChange: function(e) {
    this.setData({
      indexWorkDate: e.detail.value,
      selectWorkDate: this.data.workdate[e.detail.value].code
    });
  },

  bindSaleNumChange: function(e) {
    this.setData({
      indexSaleNum: e.detail.value,
      selectSaleNum: this.data.salenum[e.detail.value].code,
    });
  },
  bindInfoFromChange: function(e) {
    this.setData({
      indexInfoFrom: e.detail.value,
      selectInfoFrom: this.data.infofrom[e.detail.value].code,
    });
  },
  GetDataDictionary: function(type) {
    var that = this;
    util.request(
      app.data.apiurl + "api/Index/GetDataDictionary", {
        type: type
      },
      function(res) {
        if (type == '03') {
          /*res.data.list.unshift({
            name: "全部",
            code: "ALL"
          });*/
          that.setData({
            channel: res.data.list,
            indexChannel: 0,
            selectChannel: ''
          });
        } else if (type == '04') {
          res.data.list.unshift({
            name: "请选择从业时间",
            code: ""
          });
          that.setData({
            workdate: res.data.list,
            indexWorkDate: 0,
            selectWorkDate: ''
          });
        } else if (type == '05') {
          res.data.list.unshift({
            name: "请选择月销量",
            code: ""
          });
          that.setData({
            salenum: res.data.list,
            indexSaleNum: 0,
            selectSaleNum: ''
          });
        } else if (type == '06') {
          res.data.list.unshift({
            name: "请选择消息来源",
            code: ""
          });
          that.setData({
            infofrom: res.data.list,
            indexInfoFrom: 0,
            selectInfoFrom: ''
          });
        }
      }
    );
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