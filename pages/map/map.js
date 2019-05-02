var app = getApp();
Page({
  data: {
    latitude: 23.099994,
    longitude: 113.324520,
    markers: [{
      id: 1,
      latitude: 23.099994,
      longitude: 113.324520,
      name: 'T.I.T 创意园'
    }],
    covers: [{
      latitude: 23.099994,
      longitude: 113.344520,
      iconPath: app.data.fileurl + '/image/location.png'
    }, {
      latitude: 23.099994,
      longitude: 113.304520,
      iconPath: app.data.fileurl + '/image/location.png'
    }]
  },
  onLoad: function (options) {
    this.setData({
      latitude: options.latitude,
      longitude: options.longitude,
      markers: [{
        id: 1,
        latitude: options.latitude,
        longitude: options.longitude,
        name: options.name
      }],
      covers: [{
        latitude: options.latitude,
        longitude: options.longitude,
        iconPath: app.data.fileurl + '/image/location.png'
      }, {
        latitude: options.latitude,
        longitude: options.longitude,
        iconPath: app.data.fileurl + '/image/location.png'
      }]
    });
  },
  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap')
  },
  getCenterLocation: function () {
    this.mapCtx.getCenterLocation({
      success: function(res){
        console.log(res.longitude)
        console.log(res.latitude)
      }
    })
  },
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },
  translateMarker: function() {
    this.mapCtx.translateMarker({
      markerId: 1,
      autoRotate: true,
      duration: 1000,
      destination: {
        latitude:23.10229,
        longitude:113.3345211,
      },
      animationEnd() {
        console.log('animation end')
      }
    })
  },
  includePoints: function() {
    this.mapCtx.includePoints({
      padding: [10],
      points: [{
        latitude:23.10229,
        longitude:113.3345211,
      }, {
        latitude:23.00229,
        longitude:113.3345211,
      }]
    })
  }
})