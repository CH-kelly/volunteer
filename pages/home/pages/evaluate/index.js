// pages/home/pages/evaluate/index.js

const app = getApp();
const apiServer = require("../../../../utils/request")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    yuyue_id:0,
    data:[],
    start:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.data.time)
    let token = wx.getStorageSync('token') || app.globalData.token;
    let uid = wx.getStorageSync('uid') || app.globalData.uid;
    let yuyue_id = options.yuyue_id
    if(token){
      this.setData({
        token:token,
        uid:uid,
        yuyue_id:yuyue_id
      })
      this.get_lists();
    }else{
      wx.navigateTo({
        url: '/pages/auto/index',
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  get_lists(){
    var that = this;
    apiServer.post("/Venue/comments",{

      yuyue_id:this.data.yuyue_id,
      token:this.data.token,
      uid:this.data.uid

    }).then(res=>{
      console.log(res);
      if(res.code == 1){
        let level = res.data.level;
        let repair = 5 - level;
        let arr1 = "1-".repeat(level);
        let arr2 = "2-".repeat(repair);
        let arr =(arr1+arr2).split('-');
        arr.length = 5;
        console.log(arr)
        that.setData({
          data:res.data,
          start:arr
        })
      }
    })
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