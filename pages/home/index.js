// pages/home/index.js
const app = getApp();
const apiServer = require("../../utils/request")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:[],
    code:'',
    isLogin:0,
    session_key:'',
    openid:'',
    activitynum:0,
    venuenum:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户信息
    
    let openid = app.globalData.openid || wx.getStorageSync('openid');
    this.get_user_info(openid)

  },
  bindGetUserInfo(e){
    var that = this;
    wx.login({
      success (res) {
        if (res.code) {
          apiServer.get("/wxapp/login",{code:res.code}).then(res=>{
            console.log(res);
            if(res.code === 1){
              app.globalData.openid = res.data.openid;
              let openid = res.data.openid;
              wx.setStorageSync('openid',res.data.openid)

              that.setData({
                code:res.code,
                session_key:res.data.session_key,
                openid:res.data.openid,
              })
              if(e.detail.userInfo){
                let {encryptedData,iv,signature,userInfo} = e.detail;
                let session_key = res.data.session_key
                let data = {
                  data:encryptedData,
                  iv:iv,
                  sessionKey:session_key
                }
                //授权登录
                apiServer.post("/wxapp/auth",data).then(res=>{
                  console.log(res);
                  if(res.code == 1){
                      that.get_user_info(openid)
                      app.globalData.userInfo = res.data.userinfo;
                      app.globalData.uid = res.data.userinfo.user_id;
                      wx.setStorageSync('userInfo',JSON.stringify(res.data.userinfo))
                      wx.setStorageSync('uid',res.data.userinfo.user_id)
                      that.setData({
                        userInfo:res.data.userinfo,
                        isLogin:1
                      })
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
  gotoSignUp(){   //我的报名
    if(this.data.isLogin == 1){
      wx.navigateTo({
        url: '/pages/home/pages/signUp/index',
      })
    }
  },
  gotoAppointment(){    //我的预约
    if(this.data.isLogin == 1){
      wx.navigateTo({
        url: '/pages/home/pages/appointment/index',
      })
    }
  },
  gotoScheduling(){    //我的排班
    if(this.data.isLogin == 1){
      wx.navigateTo({
        url: '/pages/home/pages/scheduling/index',
      })
    }
  },
  gotoEditInfo(){    //我的资料
    if(this.data.isLogin == 1){
      wx.navigateTo({
        url: '/pages/home/pages/editInfo/index',
      })
    }
  },
  get_user_info(openid){
    let that =this;
    apiServer.post("/user/index",{openid}).then(res=>{
      if(res.code == 1){
          app.globalData.userInfo = res.data.user;
          app.globalData.uid = res.data.user.user_id;
          wx.setStorageSync('userInfo',JSON.stringify(res.data.user))
          wx.setStorageSync('uid',res.data.user.user_id)
          wx.setStorageSync('token',res.data.user.token)
          that.setData({
            userInfo:res.data.user,
            activitynum:res.data.activitynum,
            venuenum:res.data.venuenum,
            isLogin:1
          })
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