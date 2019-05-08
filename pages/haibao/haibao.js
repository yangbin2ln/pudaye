var util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
    imgPath: ''
  },
  onLoad: function (options) { 
    wx.showShareMenu({
      withShareTicket: true
    });   
    let self = this;
    util.request(
      app.data.apiurl + '/wechat/createQrCode', {
        id: options.id,
      },
      function(res) {
        self.setData({
          imgPath: app.data.fileurl + res.data.urlPath
        })
      }
    );
  },
  onReady: function (e) {
    
  },
  
})