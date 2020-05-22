// pages/appointment/detail/index.js
const app = getApp();
const apiServer = require("../../../utils/request")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    background:[
     "/static/images/appointment/background.png",
     "/static/images/appointment/background.png",
     "/static/images/appointment/background.png",
    ],
    detail:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id || 0,
    })
    this.getDetail();
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
  apply(){
    wx.navigateTo({
      url: '/pages/appointment/apply/index',
    })
  },
  getDetail(){
    apiServer.get("/Venue/getinfo",{id:this.data.id}).then(res=>{
      console.log(res);
      app.showmessage(res.msg);
      if(res.code === 1){
        this.setData({
          detail:res.data,
          background:res.data.banner_images,
        })
      }
    })
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