var util = require('../../utils/util.js');
var filter = require('../../utils/filter.js');
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    fileurl: getApp().data.fileurl,
    goodsList: [],
    lunboImg: [],
    dormitoryName: '',
    sort_group: ['销量', '价格', '人气', '筛选'],

    isLogin: false,
    
    keywords: "",
    
  },
  
  searchtopInput: function(e) {
    let self = this;
    this.setData({
      searchtop: e.detail.value
    });
  },
  searchtop: function(e) {
    let self = this;
    util.request(
      app.data.apiurl + '/web/dormitoryinfo/loadAllGrid', {
        dormitoryName: self.data.searchtop,
      },
      function(res) {
        let data = res.data;
        for(key in data){
          if(data[key].labelNames){
            data[key].labelNamesArr = data[key].labelNames.split(',');
          }
          if(data[key].smallImgs){
            let sarr = JSON.parse(data[key].smallImgs);
            if(sarr.length > 0){
              data[key].smallImgSin = sarr[0].filePath;
            }
          }
        }
        self.setData({
          goodsList: res.data
        });
      }
    );
  },
  
  goTop: function(e) {
    this.setData({
      scrollTop: 0
    });
  },
  onLoad: function (query) {
    // const scene = decodeURIComponent(query.scene)
    console.log("index 生命周期 onload", query, decodeURIComponent(query.scene))

    if(query.scene){
      let goodsId = decodeURIComponent(query.scene);
        wx.navigateTo({
          url: '../goods/goods?id=' + goodsId
        });
    }


    //设置可转发
    wx.showShareMenu({
      withShareTicket: true
    });

      if(!app.isLogin()){
        wx.redirectTo({
          url: '/pages/user/login_reg/login_reg',
        });
      }else if(!app.isBindMobile()){
        wx.redirectTo({
          url: '/pages/user/forget/forget',
        });
      }
  },
  onShow: function(){
    let self = this;

    this.getLunbo();

    util.request(
      app.data.apiurl + '/web/dormitoryinfo/loadAllGrid', {
        dormitoryName: self.data.dormitoryName,
      },
      function(res) {
        let data = res.data;
        for(key in data){
          if(data[key].labelNames){
            data[key].labelNamesArr = data[key].labelNames.split(',');
          }
          if(data[key].smallImgs){
            let sarr = JSON.parse(data[key].smallImgs);
            if(sarr.length > 0){
              data[key].smallImgSin = sarr[0].filePath;
            }
          }
        }
        self.setData({
          goodsList: res.data
        });
      }
    );
    
  },

  getLunbo: function(){
    let self = this;
    util.request(
      app.data.apiurl + '/web/indexlunbo/loadAllGrid', {
         
      },
      function(res) {
        let imgsStr = res.data[0].imgs;
        let imgsArr = JSON.parse(imgsStr);
        let arr = [];
        for(key in imgsArr){
          arr.push(app.data.fileurl + imgsArr[key].filePath)
        }
        self.setData({
          lunboImg: arr
        });
      }
    );
  }
 
  // startPullDownRefresh() {
  //   // wx.stopPullDownRefresh()
  // }
})