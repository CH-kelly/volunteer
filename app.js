//app.js

const apiServer = require("/utils/request")
App({
  events:null,
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  checkPhone(phone){
    if (!/^1(3|4|5|7|8)\d{9}$/.test(phone)) {
      return false
  } else {
     return true;
  }
  },
  showmessage(mes,icon="none"){
    wx.showToast({
      title: mes,
      icon:icon,
      duration:3000
    })
  },
  globalData: {
    userInfo: null,
    openid:null,
    token:'',
    uid:0,
    identityType:0,
    timeslot:[],
    timer:''
  }
})