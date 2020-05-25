// pages/appointment/choiceTime/index.js
const app = getApp();
const apiServer = require("../../../utils/request")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:1,
    venue_id:1,
    token:'',
    lists:[],
    radioArray:[],
    timeslot:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type:options.type
    })
  },
  onMyEvent: function(e){   //日历组件提交的时间
    let time = e.detail.year + '-' + e.detail.month + '-'+e.detail.date
    let token = wx.getStorageSync('token') || app.globalData.token;
    this.setData({
      time:time,
      token:token
    })
    this.getvenuepaiban({
      time:time,
      venue_id:this.data.venue_id,
      token:this.data.token,
    })
  },
  onClickCalendar(){},
  choice(e){  //只能选择连续的，不能跨节跨天预约
    let radioArray = this.data.radioArray;
    let index = e.currentTarget.dataset.id;
    let keys = radioArray.indexOf(index);
    var end = radioArray[radioArray.length-1]
    
    let lists = this.data.lists;
    if(keys != -1){
      let len = radioArray.length - keys;
      radioArray.splice(keys,len);
    }else{

      if((end + 1) !== index && radioArray.length!=0){
        wx.showToast({
          title: '不能跨节预约',
          icon:'none'
        })
        return 
      }
      radioArray.push(index)
    }
    let timeslot = [];
    radioArray.forEach(item=>{
      timeslot.push(lists[item].time)
    })
    this.setData({
      radioArray:radioArray,
      timeslot:timeslot
    });
    
  },
  getvenuepaiban(data){
    var that = this;
    apiServer.post("/paiban/getvenuepaiban",data).then(res=>{
      if(res.code == 1){
        that.setData({
          lists:res.data,
          radioArray:[],
          timeslot:[]
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
    app.globalData.timer = this.data.time;
    app.globalData.timeslot = this.data.timeslot;
  },
  submit(){
    app.globalData.timer = this.data.time;
    app.globalData.timeslot = this.data.timeslot;
    wx.navigateBack({
      delta: 1
    })
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