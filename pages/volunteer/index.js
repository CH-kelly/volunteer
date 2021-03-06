// pages/volunteer/index.js
const app = getApp();
const apiServer = require("../../utils/request")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists:[],
    page:0,
    isShowFloat:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getLists(this.data.page);
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
  getLists(page){
    var that = this;
    apiServer.get("/Activity/index",{offset:page}).then(res=>{
      if(res.code === 1){
        let lists = that.data.lists;
        if(page > 0){
          lists.push(...res.data.list);
        }else{
          lists = res.data.list
        }
        that.setData({
          lists:lists,
          page:page
        })
      }
    })
  },
  gotoScheduling(){    //跳转到我的排班
    var token = wx.getStorageSync('token')
    if(token){
      wx.navigateTo({
        url: '/pages/home/pages/scheduling/index',
      })
    }
  },
  clickFloatLeft(){
    this.setData({
      isShowFloat:!this.data.isShowFloat
    })
  },
  gotoDetail(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/volunteer/detail/index?id='+id,
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
    wx.showLoading({
      title: '加载中',
    })
    let page = this.data.page;
    let that = this;
    setTimeout(function () {
      wx.hideLoading()
      that.getLists(page);
      wx.stopPullDownRefresh()
    }, 2000)
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let page = this.data.page + 1;
    let that = this;
    that.getLists(page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})