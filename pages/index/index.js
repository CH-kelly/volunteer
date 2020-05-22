// pages/volunteer/index.js
const app = getApp();
const apiServer = require("../../utils/request")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner:[
      "/static/images/index3.png",
      "/static/images/index3.png",
      "/static/images/index3.png",
      "/static/images/index3.png",
      "/static/images/index3.png",
      "/static/images/index3.png",
    ],
    activity:[],
    venue:[],
    oldactivity:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getLists();
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
  getLists(){
    var that = this;
    apiServer.get("/index/index",{offset:0,limit:4}).then(res=>{
      console.log(res);
      if(res.code === 1){
        that.setData({
          banner:res.data.banner,
          activity:res.data.activity,
          venue:res.data.venue,
          oldactivity:res.data.oldactivity,
        })
      }
    })
  },
  volunteerMore(){  //志愿者招募 - 更多
    wx.switchTab({
      url: '/pages/volunteer/index',
    })
  },
  venueMore(){  //场馆预约 - 更多
    wx.switchTab({
      url: '/pages/appointment/index',
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