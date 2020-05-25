// pages/appointment/identity/index.js

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:1, //身份类型  1校内人员  2校外人员
    venue_id:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      venue_id:options.venue_id || 0
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  changeIdentity(e){
    this.setData({
      id:e.currentTarget.dataset.id
    })
  },
  submit(){
    if(!this.data.venue_id){
      app.showmessage('请选择场馆');
      return;
    }
    if(!this.data.id){
      app.showmessage('请选择身份');
      return;
    }
    wx.navigateTo({
      url:"/pages/appointment/apply/index?venue_id="+this.data.venue_id+"&type="+this.data.id
    })
    app.globalData.identityType = this.data.id;
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