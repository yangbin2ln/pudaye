console.log(123)

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')


}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const isMobile = mobile => {
  var reg1 = /^(0|86|17951)?(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57]|19[0-9]|)[0-9]{8}$/;
  return reg1.test(mobile);
}

const showModal = function (msg, success) {
  if (typeof success == "function") {
    wx.showModal({
      title: '',
      content: msg,
      showCancel: false,
      success: success
    })
  } else {
    wx.showModal({
      title: '',
      content: msg,
      showCancel: false,
    })
  }
 
};

const isIdCard = function(card) {
  // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X 
  var reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/;
  return reg.test(card);
}

const isEmail = function (email) {
  var reg1 = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)/;

  return reg1.test(email);
}
function request(url, data, doSuccess, method, showLoading,doFail, doComplete) {
  if (typeof method != "string") {
    method = "get";
  }

  if (showLoading) {
    wx.showLoading({
      title: '处理中',
    });
  }

  var logininfo = wx.getStorageSync(getApp().data.logininfokey);
  data.userId = logininfo.id;

  //网络请求
  wx.request({
    url: url,
    data: data,
    method: method,
    // 设置请求的 header
    header: {
      'content-type': 'application/json; charset=utf-8'
    },
    success: function(res) {
      if (typeof doSuccess == "function") {
        if (!res.data.success) {
          showModal(res.data.message);
        } else {
          doSuccess(res.data);
        }
      }
    },
    fail: function(res) {
      if (typeof doFail == "function") {
        //doFail(res);
      }
      console.log(res)
    },
    complete: function(res) {
      if (showLoading) {
        wx.hideLoading();
      }

      if (typeof doComplete == "function") {
        doComplete(res);
      }
    }
  })
}

module.exports = {
  formatTime: formatTime,
  isMobile: isMobile,
  showErrorModal: showModal,
  isIdCard: isIdCard,
  request: request,
  isEmail: isEmail
}