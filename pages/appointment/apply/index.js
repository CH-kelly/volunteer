// pages/appointment/apply/index.js
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    endTime:'',
    startTime:'',
    agree1:0,
    agree2:0,
    
    index: 0,
    array: ['校内预约', '校外预约'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var startTime = util.formatTime1(new Date());
    this.setData({
      startTime:startTime,
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
  bindApplyType: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindDateChange: function(e) {
    this.setData({
      startTime: e.detail.value
    })
  },
  bindDateChange1: function(e) {
    this.setData({
      endTime: e.detail.value
    })
  },
  submit(){
    let phone = this.data.phone;
    if(phone){
      if(app.checkPhone(phone) == false){
        app.showmessage('请填写正确的手机号');
      }
    }
    
    wx.navigateTo({
      url: '/pages/appointment/examine/index',
    })
  },
  clickAgree(e){
    this.setData({
      agree1:!this.data.agree1,
    })
  },
  clickAgree2(e){
    this.setData({
      agree2:!this.data.agree2,
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