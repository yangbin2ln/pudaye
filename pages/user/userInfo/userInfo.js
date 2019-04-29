var util = require('../../../utils/util.js');
var app = getApp()
Page({
  data: {
    items: [{
      name: '男',
      value: '1'
    },
    {
      name: '女',
      value: '0',
    },
    ],
    birthday: "",
    content: "",
    email: "",
    sex: 0,
    date: '',
    oldPassword: "",
    newPassword: "",
    rnewPassword: "",
    ishow: 1,
    username: "",
    mobile: ""
  },
  radioChange: function (e) {
    this.data.sex = e.detail.value;
  },
  weiNo: function (e) {
    this.data.content = e.detail.value;
  },
  email: function (e) {
    this.data.email = e.detail.value;
  },
  //  点击日期组件确定事件  
  bindDateChange: function (e) {
    this.setData({
      birthday: e.detail.value
    })
  },
  updateUserInfo: function (e) {
    if (this.data.email == "") {
      util.showErrorModal("电子邮件地址不能为空");
      return;
    }
    else if (!util.isEmail(this.data.email)) {
      util.showErrorModal("您输入的电子邮件地址格式不正确！");
      return;
    }
    var self = this;
    util.request(app.data.apiurl + 'api/Index/UpdataUserInfo', {
      user_id: app.data.logininfo.user_id,
      sex: self.data.sex,
      email: self.data.email,
      birthday: self.data.birthday,
      content: self.data.content
    }, function (res) {
      util.showErrorModal("更新完成");
    });
  },
  oldPassword: function (e) {
    this.data.oldPassword = e.detail.value;
  },
  newPassword: function (e) {
    this.data.newPassword = e.detail.value;
  },
  rnewPassword: function (e) {
    this.data.rnewPassword = e.detail.value;
  },
  editPassword: function (e) {
    // if (this.data.oldPassword == "") {
    //   util.showErrorModal("原密码不能为空");
    //   return;
    // }
    if (this.data.newPassword == "") {
      util.showErrorModal("新密码不能为空");
      return;
    }
    if (this.data.newPassword != this.data.rnewPassword) {
      util.showErrorModal("两次密码不一致");
      return
    }

    var self = this;
    util.request(app.data.apiurl + 'api/Index/EditPassword', {
      user_id: app.data.logininfo.user_id,
      oldPassword: self.data.oldPassword,
      newPassword: self.data.newPassword
    }, function (res) {
      if (res.data.list == 0) {
        util.showErrorModal("原密码不正确");
      } else {
        util.showErrorModal("修改成功");
      }
    });
  },
  cancelOpenId: function (e) {
    var self = this;
    wx.showModal({
      title: '解除微信号',
      content: '确定要解除微信号吗？',
      showCancel: true,//是否显示取消按钮
      confirmText: "解除",//默认是“确定”
      success: function (res) {
        if (res.confirm) {
          util.request(app.data.apiurl + 'api/Index/UpdateOpenid', {
            openid: '',
            user_id: app.data.logininfo.user_id
          }, function (res) {
            var logininfo = {};
            logininfo.user_id = "";
            logininfo.user_name = "";
            logininfo.user_rank = "";
            app.data.logininfo = logininfo;
            self.setData({
              isLogin: false
            });
            wx.removeStorageSync(app.data.logininfokey);
            util.showErrorModal("解除完成", function () {
              wx.redirectTo({
                url: '/pages/user/login_reg/login_reg',
              })
            });
          });
        }
      },
    })
  },
  onLoad: function (Options) {

    // 检查是否已经登录
    var self = this;
    if (!app.loginCheck()) {
      return;
    }

    var self = this;
    util.request(app.data.apiurl + 'api/Index/GetUserInfo', {
      user_id: app.data.logininfo.user_id
    }, function (res) {
      if (res.data.list.length > 0) {
        if (res.data.list[0].sex == 0) {
          self.data.items[1].checked = true;
          self.data.items[0].checked = false;
        } else {
          self.data.items[0].checked = true;
          self.data.items[1].checked = false;
        }
        self.setData({
          birthday: res.data.list[0].birthday,
          content: res.data.list[0].content,
          email: res.data.list[0].email,
          items: self.data.items,
          ishow: res.data.list[0].ishow,
          sex: res.data.list[0].sex,
          username: res.data.list[0].username,
          mobile: res.data.list[0].mobile
        });
      }
    });
  }
})