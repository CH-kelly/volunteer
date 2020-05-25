// pages/auto/index.js
const app = getApp();
const apiServer = require("../../utils/request")
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  bindGetUserInfo(e){
    var that = this;
    wx.login({
      success (res) {
        console.log(res)
        if (res.code) {
          apiServer.get("/wxapp/login",{code:res.code}).then(res=>{
            if(res.code === 1){
              let openid = res.data.openid;
              app.globalData.openid = openid;
              wx.setStorageSync('openid',openid)
              if(e.detail.userInfo){
                let {encryptedData,iv} = e.detail;
                let session_key = res.data.session_key
                let data = {
                  data:encryptedData,
                  iv:iv,
                  sessionKey:session_key
                }
                //授权登录
                apiServer.post("/wxapp/auth",data).then(res=>{
                  if(res.code == 1){
                      that.get_user_info(openid)
                      app.globalData.openid = res.data.openid;
                      app.globalData.userInfo =res.data.userinfo;
                      app.globalData.uid = res.data.userinfo.user_id;
                      wx.setStorageSync('userInfo',JSON.stringify(res.data.userinfo))
                      wx.setStorageSync('uid',res.data.userinfo.user_id)
                      app.showmessage('登录成功',"success");
                      setTimeout(() => {
                        wx.navigateBack({
                          delta:1
                        })
                      }, 3000);
                  }
                  
                })
              }
            }
          })
          wx.setStorageSync('code',res.code)
        }
      }
    })

  },
  get_user_info(openid){
    apiServer.post("/user/index",{openid}).then(res=>{
      if(res.code == 1){
          app.globalData.userInfo = res.data.user;
          app.globalData.uid = res.data.user.user_id;
          wx.setStorageSync('userInfo',JSON.stringify(res.data.user))
          wx.setStorageSync('uid',res.data.user.user_id)
          wx.setStorageSync('token',res.data.user.token)
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})