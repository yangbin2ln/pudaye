var util = require('../../../utils/util.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collect: [],
    fileurl: getApp().data.fileurl,
  },
  onLoad: function(Options) {
     
  },
  onShow: function(){
    this.loadList();
  },

  goHome: function(){
    wx.switchTab({
      url: '../../index/index'
    });
  },

  loadList: function(){
    let self = this;
    util.request(
      app.data.apiurl + '/web/dormitoryinfo/loadAllGrid/collect', {

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
          collect: res.data
        });
      }
    );
  }

})