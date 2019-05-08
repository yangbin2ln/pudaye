var util = require('../../utils/util.js');
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
     fileurl: getApp().data.fileurl,
     collected: false,
     floorstatus: false
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
  onShareAppMessage() {

  },
  gotocart: function (e) {
    if(e.currentTarget.dataset.phone){
      wx.makePhoneCall({
        phoneNumber: e.currentTarget.dataset.phone // 仅为示例，并非真实的电话号码
      })
    }
  },
 
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    //设置可转发
    wx.showShareMenu({
      withShareTicket: true
    });

    util.request(
      app.data.apiurl + '/web/dormitoryinfo/load', {
        id: options.id,
      },
      function(res) {
        let lunboImgs = res.data.lunboImgs;
        let huxingImgs = res.data.huxingImgs;
        if(lunboImgs){
          lunboImgs = JSON.parse(lunboImgs);
        }
        if(huxingImgs){
          huxingImgs = JSON.parse(huxingImgs);
        }
        let data = {
          lunboImgsArr: lunboImgs,
          huxingImgsArr: huxingImgs,
          labelNamesArr: res.data.labelNames.split(','),
         }
         for(key in res.data){
           data[key] = res.data[key];
         }
         self.setData(data);

         wx.setNavigationBarTitle({
          title: self.data.dormitoryName
        })
      }
    );

  },
  
  viewImg: function(e){
    getApp().viewImg(e);
  },

  collect: function(e){
    let self = this;
    let id = this.data.id;
    util.request(
      app.data.apiurl + '/web/usercollectdor/add', {
        dormitoryId: id
      },
      function(res) {
        wx.showToast({
          title: '收藏成功',
          icon: 'success',
          duration: 2000
        });
        self.setData({
          collected: true
        })  
      }
    );
  },

  nocollect: function(e){
    let self = this;
    let id = this.data.id;
    util.request(
      app.data.apiurl + '/web/usercollectdor/delete', {
        dormitoryId: id
      },
      function(res) {
        wx.showToast({
          title: '已取消收藏',
          icon: 'success',
          duration: 2000
        })
        self.setData({
          collected: false
        })
        
      }
    );
  }
})